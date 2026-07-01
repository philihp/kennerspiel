# 15 — Worker-pool self-play CLI

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [14](14-selfplay-v2.md) |
| Milestone | M4 |

## Goal

Saturate all CPU cores generating self-play games into a run directory, with
resume-by-default so an interrupted overnight job loses nothing.

## Design

- `agent/src/cli/selfplay.ts` rewritten around run dirs (the v1 positional
  form keeps working during transition):

```sh
pnpm --dir agent selfplay --run runs/r1 --gen 3 --games 500 --workers 12 \
  [--net runs/r1/best.onnx] [--sims 200]
```

- `worker_threads` pool; each worker owns its own evaluator instance
  (RolloutEvaluator when `--net` is absent ⇒ gen-0 needs no new concepts;
  OnnxEvaluator per [21](21-onnx-evaluator.md) when present) and appends to
  its own `gen-NNN/selfplay/worker-K.jsonl` (no write contention).
- Seeds: `baseSeed + gameIndex`, assigned by a main-thread dispenser —
  deterministic set of games regardless of worker count.
- **Resume**: on start, count existing JSONL lines across workers and only
  generate the remainder. Rerunning the same command is the resume story.
- Progress: one status line per N games (games/hr, avg steps, avg ms/move).

## Inputs

- `runs/<id>/config.json` (game cfg + search params), `--gen`, `--games`,
  `--workers`, optional `--net` ONNX path.

## Outputs

- `runs/<id>/gen-NNN/selfplay/worker-*.jsonl` (JSONL v2), and the `STATE`
  marker advanced to `selfplay` when the target count is reached.

## How it runs / verification

- `pnpm --dir agent test` — seed dispenser determinism; resume counting.
- Manual: run with `--games 8 --workers 2`, kill mid-way, rerun, verify
  exactly 8 games and no duplicate seeds.
