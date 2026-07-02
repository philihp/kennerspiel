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

### Loss (exact formulas)

For a batch of `B` decisions with ragged candidates (`Mb` total), targets
`π` (visit fractions) and `z` (rotated outcome vector + mask `m`), model
outputs `p = segment_softmax(logits)` and `v = sigmoid(value)`:

```
L_policy = −(1/B) · Σ_d Σ_{i ∈ cand(d)} π_{d,i} · log p_{d,i}      (CE vs a soft target)
L_value  = (1 / Σ m) · Σ_{d,s} m_{d,s} · (v_{d,s} − z_{d,s})²      (masked MSE)
L        = L_policy + λ · L_value                                   λ = 1.0
```

Regularization is **decoupled weight decay** via AdamW
(`weight_decay = 1e-4`), *not* an explicit `c·‖θ‖²` term in `L`; decay is
skipped for norms, biases, and embedding rows (standard no-decay groups).
`L_policy` uses `segment_log_softmax` from [18](18-model.md) — never
`exp().log()`.

### Optimizer & LR schedule

- AdamW, β = (0.9, 0.999), `weight_decay = 1e-4`, gradient clip at
  `‖g‖₂ ≤ 1.0` (logged, so spikes are visible).
- Batch: 256 decisions (≈ 4,600 candidate rows at median branching).
- Schedule per invocation: linear warmup over the first 200 steps →
  cosine decay from `lr_max = 1e-3` to `lr_min = 1e-5` across the planned
  step budget. The budget is computed up front (below), so cosine has a
  defined horizon; `--max-steps` overrides it.

### Window sampling

- **Sliding window**: train on shards from the last `K = 5` generations
  (`--window`), discovered via `data.py` ([17](17-trainer-scaffold.md));
  fewer if the run is young. Gen-0 trains on gen-0 alone.
- Sampling is uniform over all rows in the window (shard-order shuffling per
  [17](17-trainer-scaffold.md)); the freshest generation is **not**
  oversampled initially — recency weighting is a recorded tunable, not a
  day-one feature.
- **Step budget instead of epochs**: `steps = ceil(E · rows_window / 256)`
  with `E = 1.0` effective epochs by default (`--epochs` scales it). This
  keeps wall-clock and sample-reuse constant as the window fills up: with a
  full window each row is seen ~once per generation, ~K times total across
  its lifetime — squarely in AlphaZero's healthy reuse range.

### Logging — `train-log.jsonl` schema

One JSON object per logging interval (every 50 steps) plus a `"type":
"summary"` line at the end:

```jsonc
{ "type": "step", "ts": "2026-07-01T12:00:00Z", "gen": 3, "step": 1250,
  "lr": 4.1e-4, "loss": 2.31, "policy_loss": 1.98, "value_loss": 0.33,
  "top1_agree": 0.44,          // argmax p == chosen (fraction of batch)
  "policy_entropy": 2.1,       // mean per-decision entropy of p
  "value_mae": 0.31, "grad_norm": 0.8, "rows_seen": 320000 }
{ "type": "summary", "gen": 3, "steps": 5860, "wall_s": 1410,
  "final": { "loss": 1.71, "top1_agree": 0.58 },
  "value_calibration": [[0.05, 0.11], [0.15, 0.18], …] }  // pred-bucket → actual mean
```

`top1_agree` and `policy_entropy` are the two instant sanity signals:
agreement should climb from ~1/branching, entropy should fall from
`log(branching)` but not to ~0 (that's the overfit signature).

### Checkpoint & resume

`gen-NNN/ckpt/model.pt` (torch.save of a dict):

```python
{ "model": state_dict, "optimizer": state_dict, "sched_step": int,
  "global_step": int, "rows_seen": int,
  "spec": { "featureSpecVersion": …, "actionSpecVersion": …,
            "featureLen": …,     "moveFeatureLen": 91 },   // from spec.json, never hardcoded
  "window": { "gens": [0,1,2,3], "shards": 512, "rows": 2_100_000 },
  "rng": { "torch": …, "numpy": …, "python": … },
  "config_hash": "…", "torch_version": "2.5.1" }
```

Written atomically (`model.pt.tmp` + rename) every 500 steps and at the end.
**Resume semantics**: `oel-train --run … --gen N` first looks for
`gen-N/ckpt/model.pt`; if present and its `config_hash` + spec versions
match, training continues from `global_step` with optimizer/scheduler/RNG
restored (data order is re-derived from the restored RNG, so a killed run and
an uninterrupted run see the same schedule, modulo the partial batch at the
kill point). If absent, **warm start**: load `model` weights (only) from the
previous promoted generation's checkpoint; fresh optimizer. Gen-0 starts from
[18](18-model.md)'s init. Version guard ([17](17-trainer-scaffold.md)) runs
before any of this.

### Overfit test — the pipeline-truth test, step by step

Lives in `trainer/tests/test_train.py`, CPU, minutes:

1. Fixture: 10 self-play games' JSONL (checked in), exported by
   [16](16-shard-exporter.md) into one shard (also checked in, so the test
   doesn't need Node).
2. Run the real `train()` entry with: window = that shard only, batch 64,
   constant `lr = 1e-3` (schedule disabled), no weight decay, ~2,000 steps.
3. Assert monotone-ish descent: loss at step 2,000 < 5% of loss at step 0.
4. Assert memorization: `policy_loss < 0.05`, masked `value_loss < 1e-3`,
   and policy top-1 == `chosen` on **every** decision (temperature sampling
   means the target π isn't one-hot; assert argmax agreement, not CE = 0).
5. If this fails, the bug is in data plumbing (slicing, rotation, offsets),
   not the model — that is the point of the test.

### CLI

```sh
uv run oel-train --run runs/r1 --gen 3 [--device auto] [--window 5]
                 [--epochs 1.0] [--max-steps N] [--batch 256] [--lr 1e-3]
```

## Design notes & tradeoffs

- **AdamW vs SGD-momentum.** Big-AZ used SGD+momentum with hand-tuned LR
  drops across millions of steps. At ~1.5 M params, thousands of steps per
  generation, and nobody babysitting LR, AdamW's per-parameter scaling is
  worth its memory (2× params ≈ 12 MB — nothing) and removes the most
  fiddly hyperparameter. The known generalization gap of Adam-family
  optimizers matters less than iteration speed here; revisit only if gating
  ([22](22-arena-gating.md)) plateaus suspiciously early.
- **Window K = 5.** Too small (1–2) and the net chases the newest data —
  policy oscillation and forgetting of openings it no longer visits. Too
  large (20+) anchors training to generations of much weaker play, diluting
  fresh signal. K = 5 at 500–2,000 games/gen ≈ 2.5k–10k games ≈ 0.6–3.5 M
  decisions — proportionally comparable to AZ's 500k-game window. Tune with
  gate results, not intuition.
- **Warm start vs fresh init each generation.** Fresh init (AlphaZero's
  original re-train-from-scratch) maximizes plasticity and can't inherit
  bad minima, but needs many more steps per gen and a big window to
  reconverge. Warm start reuses computation and is the standard modern
  choice; its risk — catastrophic drift compounding across gens — is exactly
  what arena gating exists to catch (a drifted net fails the gate; the
  champion's weights remain the warm-start source). Warm start, with
  "fresh-init every N gens" kept as a documented escape hatch.
- **Epochs-per-gen vs fixed step budget.** "2 epochs" means 5× more steps
  once the window is full — silently changing the reuse ratio as the run
  ages. A rows-derived step budget keeps effective sample reuse constant and
  makes generation wall-clock predictable for the orchestrator
  ([23](23-orchestrator.md)). `--max-steps` remains the blunt override for
  smoke runs ([24](24-smoke-e2e.md)).

## Inputs

```sh
uv run oel-train --run runs/r1 --gen 3 [--device auto] [--epochs 2] [--window 5]
```

- Shard dirs for the window; previous checkpoint if any; `spec.json`.

## Outputs

- `gen-NNN/ckpt/model.pt`, `gen-NNN/train-log.jsonl`; `STATE` → `trained`.

## How it runs / verification

- **Overfit test** (`uv run pytest -k overfit`): the five-step procedure
  above — total loss ≈ 0 and policy top-1 = chosen on every decision.
- Resume: kill mid-run, rerun same command, verify continuation from
  `global_step` (log line sequence is contiguous) and final metrics match an
  uninterrupted run within noise.
- `train-log.jsonl` lines validate against the schema; the summary line's
  calibration buckets are monotone on the overfit fixture.
