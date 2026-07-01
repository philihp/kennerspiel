# 18 — Network architecture

| | |
| --- | --- |
| Status | planned |
| Package | `trainer/` |
| Depends on | [17](17-trainer-scaffold.md) |
| Milestone | M5 |

## Goal

A policy+value net sized for minutes-per-epoch training on the 7800 XT *and*
sub-millisecond CPU ONNX inference inside Node self-play workers.

## Design

Built **data-driven from `spec.json`** (offsets, grid geometry, vocab sizes)
so encoder changes don't touch Python code. ~1.5–2.5 M parameters.

- **Per-player grid** `[38, 9, 10]`: land one-hots + clergy flags stay
  continuous; the categorical erection-id channel goes through
  `nn.Embedding(256, 16)` → ~25 channels. A conv stem (3×3 → 64) + **4
  residual blocks (64 ch, GroupNorm)** shared across all four player slots,
  then per-slot global avg+max pooling → 128 each, with a learned slot
  embedding (me / next / …) added before pooling concat.
- **Scalars**: player scalars + frame + shared (~1k floats; the two 256-wide
  building masks are embedded by the first linear layer) → MLP → 256.
- **Trunk**: concat (4×128 + 256) → 512 → 256, ReLU, LayerNorm.
- **Value head**: 256 → 64 → `maxPlayers`, sigmoid — targets are the
  rank-based `[0,1]` vectors, masked by live seats. Egocentric, so 3–4-player
  support needs zero architecture change.
- **Policy head** (move-scoring, per [11](11-action-encoder.md)): move
  encoder = erection embedding (**shared table** with the grid channel) +
  linear over remaining move floats → 64; `logit = MLP(proj(trunk) ⊕ move64)`;
  segment-softmax over each decision's ragged candidate slice
  (`cand_offsets`).
- Scale up (128 ch / 8 blocks) only after the loop demonstrably learns.

## Inputs

- Batches from `data.py`; `spec.json`.

## Outputs

- `model.py`: `OelNet(spec)` returning `(values [B, maxPlayers],
  logits [M])`; segment-softmax/CE utilities shared with the training loop.

## How it runs / verification

- `uv run pytest trainer/tests/test_model.py` — forward pass on a real
  Node-exported shard: correct shapes, finite outputs, per-decision softmax
  sums to 1, gradient flows to every parameter group (embedding included).
