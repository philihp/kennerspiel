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

```
trainer/
  pyproject.toml         # deps: torch, numpy, onnx; dev: onnxruntime, pytest
  uv.lock
  src/hathora_trainer/
    data.py              # ShardDataset: mmap npy, ragged candidate batching
    device.py            # --device auto|cpu|cuda (ROCm masquerades as cuda)
    check_gpu.py         # prints torch version, device, and a tiny matmul benchmark
    model.py train.py export_onnx.py   # projects 18–20
  tests/
```

- Console scripts: `oel-train`, `oel-export-onnx`, `oel-check-gpu`.
- `data.py`: memory-map every `.npy` in a shard list; batches carry
  `(states, values, value_mask, cand_feats, cand_offsets, policy)`; a custom
  collate packs ragged candidates via offsets (segment ops in the model, no
  padding waste).
- Version guard: refuse to train if `meta.json`'s
  featureSpec/actionSpec versions differ across shards or from a resumed
  checkpoint.
- Torch install extras: `rocm` (ROCm wheel index), `cu12` (CUDA index),
  default CPU — the ≤$50 cloud path is `uv sync --extra cu12` on the same
  rsynced run dir.

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
