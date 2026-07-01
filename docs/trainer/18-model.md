# 18 — Network architecture

| | |
| --- | --- |
| Status | planned |
| Package | `trainer/` |
| Depends on | [17](17-trainer-scaffold.md) |
| Milestone | M5 |

## Goal

A policy+value net sized for minutes-per-epoch training on the 7800 XT *and*
low-millisecond CPU ONNX inference inside Node self-play workers.

## Design

Built **data-driven from `spec.json`** (offsets, grid geometry, vocab sizes)
so encoder changes don't touch Python code. Baseline ≈ **1.53 M parameters**
(arithmetic below).

### Input slicing (numbers from `game/src/encode.ts`)

A state row is a flat `[14,670]` f32 vector: 4 player blocks of 3,455
(35 scalars + a 38×9×10 grid = 3,420), then frame 549, then shared 301.
`model.py` reslices via `spec.offsets`, never hardcodes:

- **Grids**: for each slot, `states[:, off+35 : off+3455]` →
  `[B, 38, 9, 10]` → permute to `[B, 10, 38, 9]`. Channels 0–5 are land
  one-hots, channel 6 is the categorical erection id (0 = empty, ids 1–80
  live in a 256 capacity), channels 7–9 are clergy flags. Channel 6 is cast
  to long and embedded; the rest stay continuous floats.
- **Scalars**: 4×35 player scalars + frame 549 + shared 301 = **990 floats**
  (this includes the frame's two 256-wide usable/unusable building masks and
  the shared 256-wide availability mask, absorbed by the first linear layer).

### Layer-by-layer, with parameter arithmetic

| # | Stage | In → out | Params |
| --- | --- | --- | --- |
| 1 | Erection embedding `nn.Embedding(256, 16)` (shared with 8) | id → 16 | 256·16 = **4,096** |
| 2 | Grid assembly: 6 land + 3 clergy + 16 emb | `[B·4, 25, 38, 9]` | 0 |
| 3 | Conv stem 3×3, 25→64 + GN(8, 64) | → `[B·4, 64, 38, 9]` | 25·64·9+64 = 14,400+64; GN 128 → **14,592** |
| 4 | 4× residual block: (conv3×3 64→64 + GN + ReLU) ×2 + skip | same | 4·(2·(64·64·9+64) + 2·128) = 4·74,112 = **296,448** |
| 5 | Slot embedding (4 learned 64-vectors, added per-channel), then per-slot global avg+max pool | → 4 × 128 → concat 512 | 4·64 = **256** |
| 6 | Scalar MLP: 990 → 512 → ReLU → 256 | → 256 | 990·512+512 + 512·256+256 = 507,392+131,328 = **638,720** |
| 7 | Trunk: concat(512+256=768) → 512 → ReLU → 256, LayerNorm(256) | → 256 | 768·512+512 + 512·256+256 + 512 = **525,568** |
| 8 | Move encoder: 89 move floats ⊕ emb(erection id, table from 1) = 105 → 64 | `[Mb, 64]` | 105·64+64 = **6,784** |
| 9 | Policy head: proj 256→64; logit MLP concat(64+64=128) → 64 → 1 | → `[Mb]` | 16,448 + 8,256 + 65 = **24,769** |
| 10 | Value head: 256 → 64 → 4, sigmoid | → `[B, 4]` | 16,448 + 260 = **16,708** |

Total: 4,096 + 14,592 + 296,448 + 256 + 638,720 + 525,568 + 6,784 + 24,769 +
16,708 = **1,527,941 ≈ 1.53 M**. Room to 2.5 M exists (channels 64→96 or a
wider scalar MLP) without touching the interface.

The four player grids run through **one shared conv trunk** by folding slots
into the batch dim (`[B, 4, 25, 38, 9] → [B·4, 25, 38, 9]`): one conv call,
4× weight sharing, and the slot embedding (added before pooling) tells the
net *which* seat a grid is (slot 0 = "me" carries most signal).

### Heads

- **Value**: `sigmoid`, target = the rank-based `[0,1]` outcome vector
  rotated to the perspective ([16](16-shard-exporter.md)), masked by
  `value_mask`. Egocentric, so 3–4-player support needs zero architecture
  change.
- **Policy** (move-scoring, per [11](11-action-encoder.md)): each candidate's
  logit is `MLP(proj(trunk[row]) ⊕ moveEnc(cand))` where `row` is the
  candidate's decision. Signature:
  `forward(states [B,14670], cand_feats [Mb,90], cand_counts [B]) →
  (values [B,4], logits [Mb])`. Softmax is *not* in `forward`; it lives in
  the loss (below) and in the consumers ([19](19-training-loop.md),
  [21](21-onnx-evaluator.md)).

### Segment softmax over ragged candidates

Two workable torch implementations:

```python
# A — index ops on the flat [Mb] layout (chosen)
def segment_log_softmax(logits, counts):
    B, dev = counts.numel(), logits.device
    seg = torch.repeat_interleave(torch.arange(B, device=dev), counts)      # [Mb]
    mx  = torch.full((B,), -torch.inf, device=dev).scatter_reduce(0, seg, logits, 'amax')
    ex  = (logits - mx[seg]).exp()
    den = torch.zeros(B, device=dev).index_add(0, seg, ex)
    return logits - mx[seg] - den[seg].log(), seg
```

```python
# B — pad to the batch max count, mask with -inf, F.log_softmax(dim=1)
```

A works directly on the shard layout with zero padding waste and O(Mb)
memory; B is simpler to read but allocates `[B, max_count]` (up to the 128
cap) and needs pack/unpack at both ends. A is the implementation;
B is kept in tests as a reference oracle for A's correctness.

### Normalization & init

- **GroupNorm (8 groups)**, not BatchNorm: batch statistics here are
  correlated (many decisions from the same game in one batch) and inference
  runs at batch sizes 1–16 in Node — BN's train/eval running-stats gap is a
  known source of silent parity failures across the ONNX boundary. GN is
  deterministic per-sample, exports cleanly (native op at opset 18), costs
  ~nothing at these widths.
- **Init**: Kaiming fan-in (ReLU gain) for convs/linears; the second GN of
  each residual block starts at γ=0 (identity-at-init residuals); the final
  policy-logit layer and final value layer start at **zero** → step-0 priors
  are exactly uniform and step-0 values are 0.5, i.e. the net begins as the
  uniform-prior evaluator PUCT already tolerates ([13](13-puct-search.md)).

## Design notes & tradeoffs

- **Shared trunk over 4 grids vs concatenating 4×25 channels.** Concat
  (`[B, 100, 38, 9]`) makes the stem 4× wider, hard-wires seat count into
  conv weights, and loses the symmetry that seats are the *same kind* of
  object. Shared trunk + slot embedding is fewer params, seat-count-agnostic
  (empty slots are zero grids), and the fold-into-batch trick makes it one
  kernel launch either way.
- **Pooling vs flatten.** Flatten of `[64, 38, 9]` is 21,888 features/slot,
  87,552 over 4 slots; a mere 512-wide first linear on that is 87,552·512 ≈
  **44.8 M params** — 30× the entire budget, gone on positional weights the
  anchored grid mostly wastes. Avg+max pooling (128/slot) keeps "what exists"
  plus "strongest activation" at zero params; precise geometry is the conv
  stack's job.
- **Embedding dim.** 80 live erection ids (capacity 256). The
  `1.6·n^0.56` rule of thumb gives ≈19; 16 keeps the shared table (grid +
  move encoder) at 4 K params. 8 would likely bottleneck building identity —
  the single most game-relevant signal; 32 buys little at 2× cost.
- **Model size vs CPU inference latency.** Conv cost dominates:
  342 cells × (stem 4.9 M + 8×12.6 M res MACs) ≈ 106 M MACs/slot → **~0.42 G
  MACs ≈ 0.85 GFLOPs per eval** at 64 ch / 4 blocks. On onnxruntime CPU
  (~50–200 GFLOP/s effective) that's ~4–15 ms at batch 1 — likely NN-bound at
  200 sims/move, in tension with [21](21-onnx-evaluator.md)'s sub-ms hope.
  The scaling knob is nearly quadratic in channels: 48 ch/3 blocks ≈ 0.37
  GFLOPs, 32 ch/2 blocks ≈ 0.12 GFLOPs (~1–2 ms). Decision rule: baseline
  64/4 for training; if the [08](08-benchmarks.md)/[21](21-onnx-evaluator.md)
  micro-bench shows search NN-bound, drop to 32/2 *before* building batching
  infrastructure. Scale up (128 ch / 8 blocks) only after the loop
  demonstrably learns.
- **Sigmoid multi-player value vs tanh scalar.** A scalar tanh "my winrate"
  is the 2-player classic but bakes zero-sum-between-two into the head. The
  masked per-seat sigmoid vector costs 3 extra outputs, reads directly as
  "expected rank score per seat", matches the exporter's rotated targets,
  and makes 3–4-player configs a data change. PUCT consumes `value[0]`
  either way.

## Inputs

- Batches from `data.py` ([17](17-trainer-scaffold.md)); `spec.json`.

## Outputs

- `model.py`: `OelNet(spec)` returning `(values [B, maxPlayers],
  logits [Mb])`; `segment_log_softmax` / loss utilities shared with the
  training loop ([19](19-training-loop.md)).

## How it runs / verification

- `uv run pytest trainer/tests/test_model.py` — forward pass on the real
  Node-exported fixture shard: correct shapes, finite outputs, per-decision
  softmax sums to 1 (implementation A ≡ padded oracle B within 1e-6),
  gradient flows to every parameter group (embedding included), zero-init
  heads produce uniform priors and 0.5 values at step 0.
