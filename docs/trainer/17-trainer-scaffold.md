# 17 — Trainer scaffold (Python / uv)

| | |
| --- | --- |
| Status | planned |
| Package | `trainer/` (new top-level dir, not in pnpm workspace) |
| Depends on | [16](16-shard-exporter.md) |
| Milestone | M5 |

## Goal

A uv-managed Python package that loads shards and stands up the device
story: same code on ROCm (the RX 7800 XT), CUDA (rented), and CPU.

## Design

### Placement in the repo

`pnpm-workspace.yaml` lists only `game` and `agent`; `web/` already sets the
precedent of a top-level dir that is deliberately **not** a workspace member.
`trainer/` follows it — pnpm never sees it, `uv` owns it entirely. Repo-root
`.gitignore` additions: `.venv`, `__pycache__`, `*.egg-info`, and `runs/`
(run dirs are data, shared with the Node side, never committed). `uv.lock`
**is** committed — it is the Python `pnpm-lock.yaml`.

```
trainer/
  pyproject.toml
  uv.lock
  src/hathora_trainer/
    __init__.py
    spec.py              # load + validate spec.json (featureSpec/actionSpec)
    data.py              # ShardDataset, collate, window discovery, version guard
    device.py            # resolve('auto' | 'cpu' | 'cuda') -> torch.device
    check_gpu.py         # oel-check-gpu entry point
    model.py             # project 18
    train.py             # project 19
    export_onnx.py       # project 20
  tests/
    fixtures/            # one tiny Node-exported shard, checked in (~2 MB)
    test_data.py         # bit-exact shard read, collate invariants
    test_model.py test_train.py test_onnx.py   # projects 18–20
```

### `pyproject.toml` (written out)

The torch extras follow uv's documented PyTorch pattern: three mutually
exclusive extras, each pinning `torch` to a dedicated wheel index.

```toml
[project]
name = "hathora-trainer"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = ["numpy>=2.0", "onnx>=1.16"]

[project.optional-dependencies]
cpu   = ["torch>=2.5"]
rocm  = ["torch>=2.5"]
cu12  = ["torch>=2.5"]

[project.scripts]
oel-train       = "hathora_trainer.train:main"
oel-export-onnx = "hathora_trainer.export_onnx:main"
oel-check-gpu   = "hathora_trainer.check_gpu:main"

[dependency-groups]
dev = ["pytest>=8", "onnxruntime>=1.18"]

[tool.uv]
conflicts = [[{ extra = "cpu" }, { extra = "rocm" }, { extra = "cu12" }]]

[tool.uv.sources]
torch = [
  { index = "pytorch-cpu",  extra = "cpu" },
  { index = "pytorch-rocm", extra = "rocm" },
  { index = "pytorch-cu12", extra = "cu12" },
]

[[tool.uv.index]]
name = "pytorch-cpu"
url = "https://download.pytorch.org/whl/cpu"
explicit = true

[[tool.uv.index]]
name = "pytorch-rocm"
url = "https://download.pytorch.org/whl/rocm6.2"
explicit = true

[[tool.uv.index]]
name = "pytorch-cu12"
url = "https://download.pytorch.org/whl/cu124"
explicit = true

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

`uv sync --extra rocm` on the 7800 XT box ([25](25-rocm-runbook.md));
`uv sync --extra cu12` on a rental; `uv sync --extra cpu` in CI. The exact
`rocm6.x`/`cu12x` index suffixes get pinned when 25 is executed.

### `data.py` — ShardDataset

Shard files ([16](16-shard-exporter.md)) are opened with
`np.load(path, mmap_mode='r')` — zero-copy, lazy, OS page cache does the
work. One dataset item = one decision row.

```python
@dataclass
class Shard:
    states: np.memmap        # [N, 14670] f16
    values: np.memmap        # [N, 4] f32
    value_mask: np.memmap    # [N, 4] u1
    cand_feats: np.memmap    # [M, moveFeatureLen] f16
    cand_offsets: np.ndarray # [N+1] i64 (small; load eagerly)
    policy: np.memmap        # [M] f32
    chosen: np.memmap        # [N] i32
    meta: dict

def discover(run: Path, gen: int, window: int) -> list[Path]  # shard dirs, last K gens
def load_shard(d: Path) -> Shard

class ShardDataset(torch.utils.data.Dataset):
    def __init__(self, dirs: list[Path]): ...   # cumulative row index across shards
    def __len__(self) -> int
    def __getitem__(self, i) -> Row              # numpy views, no copies yet

def collate(rows: list[Row]) -> Batch
    # states:      f16 -> torch.float32  [B, 14670]
    # values/mask:                        [B, 4]
    # cand_feats:  np.concatenate -> f32  [Mb, moveFeatureLen]  (ragged)
    # cand_counts: i64                    [B]   (offsets rebuilt batch-locally)
    # policy:      f32                    [Mb]
    # chosen:      i64                    [B]  (slice-local index)
```

The collate is where ragged happens: candidate slices are concatenated in
batch order and `cand_counts` carries the segment structure; the model
([18](18-model.md)) turns counts into segment ids. States upcast f16→f32 at
collate time (CPU convs/gemms want f32; the copy is per-batch, not per-epoch).

Shuffling: `DataLoader(shuffle=True)` over the row index is correct but
random-access across ~20 GB of mmap causes page-fault storms on cold cache.
Default: shuffle shard order per epoch + shuffle rows *within* each shard,
reading shards mostly sequentially (an `IterableDataset` variant with a
small cross-shard mixing buffer, e.g. 8 shards ≈ 32k rows). Row-level global
shuffle stays available behind `--shuffle rows` for small windows.

### Version guard

```python
def assert_compatible(shard_metas: list[dict], spec: Spec, ckpt_meta: dict | None) -> None
```

Every shard's `meta.json` must agree on `featureSpecVersion`,
`actionSpecVersion`, `featureLen` (14,670) and `moveFeatureLen` — with each
other, with `spec.json`, and with a resumed checkpoint's recorded versions.
Any mismatch aborts with a message naming the offending shard; silently
training across an encoder change is the worst bug class this pipeline can
have.

### `device.py` / `check_gpu.py`

`resolve('auto')` → `cuda` if `torch.cuda.is_available()` else `cpu` — ROCm
torch masquerades as `cuda`, so nothing is ROCm-specific here.
`oel-check-gpu` prints torch version, device name, VRAM, a 4096² matmul
TFLOP/s number, and — when `/dev/kfd` exists but no device is visible —
explicitly suggests the `HSA_OVERRIDE_GFX_VERSION=11.0.0` fix from
[25](25-rocm-runbook.md).

## Design notes & tradeoffs

- **uv vs pip/poetry.** uv gives a committed cross-platform lockfile,
  per-extra index routing (the torch problem, solved natively via
  `tool.uv.sources` + `conflicts`), and `uv run` entry points with zero
  activation ceremony. pip has no lockfile story; poetry fights custom
  indexes for torch. The `≤$50 rental` path being literally `uv sync --extra
  cu12` is the argument.
- **Outside vs inside the pnpm workspace.** Inside buys nothing — pnpm can't
  install Python and its lockfile would churn on a package it doesn't manage.
  Outside (the `web/` precedent) keeps both toolchains blind to each other;
  the only contract is files on disk (`shards/`, `spec.json`, `model.onnx`),
  which is exactly the seam we want to test across.
- **mmap vs loading to RAM.** A 5-gen window can hit ~100 GB — off the table
  for eager load. mmap costs nothing when access is sequential-ish (hence
  shard-order shuffling) and lets the OS cache hot shards across epochs for
  free. Eager per-shard load into pinned buffers is a contained later
  optimization inside `load_shard` if profiling shows input-bound steps;
  the Dataset interface doesn't change.

## Inputs

- `gen-NNN/shards/` from [16](16-shard-exporter.md); `spec.json`
  (featureSpec + actionSpec).

## Outputs

- Importable `hathora_trainer` package; a working `DataLoader` over shards;
  `oel-check-gpu` diagnostics.

## How it runs / verification

```sh
cd trainer && uv sync
uv run oel-check-gpu                       # device visible, matmul runs
uv run pytest                              # incl. Node-shard bit-exact read test
```

- `test_data.py`: mmap the checked-in Node-exported fixture shard; assert
  bit-exact f16 payloads on a golden decision (the [16](16-shard-exporter.md)
  cross-language test); collate invariants — `cand_counts.sum() == Mb`,
  policy slices sum to 1, `chosen < count` per row.
- Version guard: corrupt one fixture `meta.json` field, assert loud failure.
