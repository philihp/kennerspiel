# 19 — Training loop

| | |
| --- | --- |
| Status | planned |
| Package | `trainer/` |
| Depends on | [18](18-model.md) |
| Milestone | M5 |

## Goal

Turn shards into a checkpoint: supervised AlphaZero targets (visit
distributions + outcomes), resumable, with enough logging to see learning or
its absence immediately.

## Design

- Loss: `L = CE(π, p) + λ·MSE(z, v) + c·‖θ‖²` with λ = 1.0, weight decay
  1e-4 (AdamW), cosine LR. Policy CE against visit fractions over each
  decision's candidate slice; value MSE masked by `value_mask`.
- **Sliding window**: train on shards from the last K generations (start
  K = 5), freshest generation not oversampled initially (a tunable later).
- Warm start from the previous generation's checkpoint; gen-0's net trains
  from scratch on pure-UCT data.
- Logging: `train-log.jsonl` per step — losses, policy top-1 agreement with
  `chosen`, value calibration buckets. Early-exit knobs: `--epochs`,
  `--max-steps`.
- Checkpoint: `gen-NNN/ckpt/model.pt` = weights + optimizer + spec versions +
  window definition.

## Inputs

```sh
uv run oel-train --run runs/r1 --gen 3 [--device auto] [--epochs 2] [--window 5]
```

- Shard dirs for the window; previous checkpoint if any; `spec.json`.

## Outputs

- `gen-NNN/ckpt/model.pt`, `gen-NNN/train-log.jsonl`; `STATE` → `trained`.

## How it runs / verification

- **Overfit test** (the pipeline-truth test, in `trainer/tests/`): 10 games'
  shards, no window, many epochs → total loss ≈ 0 and policy top-1 = chosen
  on every decision. If this fails, the bug is in data plumbing, not the
  model.
- Resume: kill mid-epoch, rerun same command, verify continuation from the
  checkpoint.
