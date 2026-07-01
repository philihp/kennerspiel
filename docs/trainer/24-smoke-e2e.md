# 24 — Smoke end-to-end run

| | |
| --- | --- |
| Status | planned |
| Package | repo (config + CI wiring) |
| Depends on | [23](23-orchestrator.md) |
| Milestone | M6 |

## Goal

Prove the whole loop closes — gen-0 self-play through training through a
gated gen-1 — in minutes on any machine (laptop, CI, the trashcan), so
pipeline regressions are caught before burning a GPU-day.

## Design

- `runs/smoke/config.json` (checked in): 2-player **short** game, 8
  games/gen, 16 sims, curation `{maxPerLevel: 8, maxMoves: 32}`, 2 epochs,
  window 1, gate of 6 games with threshold logged but not enforced, 2
  workers, `--device cpu`.
- Command: `pnpm --dir agent loop --config runs/smoke/config.json --gens 2`.
- Assertions after the run (a small script, `pnpm --dir agent smoke`):
  - `gen-000` used the RolloutEvaluator (netId `rollout`), `gen-001` used
    `gen-000`'s ONNX;
  - every `STATE` reached `gated`; `best.json` exists;
  - overfit-style sanity: gen-000 training loss decreased monotonically-ish
    (final < first);
  - Node ONNX evaluator output matched the Python golden batch (from
    [20](20-onnx-export.md)/[21](21-onnx-evaluator.md) fixtures).
- CI: run on every PR touching `agent/`, `game/src/{control,encode}.ts`, or
  `trainer/` (needs Python + uv in the workflow; cache the torch CPU wheel).

## Inputs

- The checked-in smoke config; no GPU, no network.

## Outputs

- A disposable `runs/smoke/` tree; pass/fail for CI.

## How it runs / verification

```sh
pnpm --dir agent loop --config runs/smoke/config.json --gens 2 && pnpm --dir agent smoke
```

Target wall-clock: < 10 minutes on a laptop CPU.
