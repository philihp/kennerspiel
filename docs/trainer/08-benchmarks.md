# 08 — Benchmark harness

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [03](03-move-enumeration.md), [07](07-engine-fast-paths.md) |
| Milestone | M1 |

## Goal

A repeatable benchmark CLI so performance claims are measured, pinned in
docs, and re-checked after every engine or search change. Self-play
throughput is the binding constraint of the whole project; this is the
instrument.

## Design

- `agent/src/cli/bench.ts`, run as `pnpm --dir agent bench`.
- State corpus: replay fixture games (e.g. the command lists in
  `game/src/__tests__/game21872.test.ts` and self-play JSONL when available),
  collecting every intermediate state — realistic mid-game states, not
  synthetic ones.
- Metrics (median / p90 / p99 over the corpus):
  - `reducer` apply per command
  - `control(state, [])` vs `completions(state, [])`
  - `enumerateMoves` at search curation caps
  - `encode` / `encodeInto`
  - branching factor distribution (legal complete moves per state)
- Output: a markdown table to stdout, pasted into this doc set when numbers
  move.

## Inputs

- Fixture command lists; optionally a JSONL file of self-play games
  (`--games <path>`).

## Outputs

- Benchmark table on stdout; pinned numbers recorded in
  [README](README.md) / PR descriptions.

## How it runs / verification

```sh
pnpm --dir agent bench
pnpm --dir agent bench --games runs/r1/gen-000/selfplay/worker-0.jsonl
```

- Sanity: numbers are stable (< ~10% jitter) across two consecutive runs on
  an idle machine.

## Baseline (previously measured, to re-verify)

| Op | Cost |
| --- | --- |
| `reducer` apply | ~0.011 ms |
| `control(state, [])` | ~0.33 ms |
| `encode` (pre-rewrite figure; expect far less now) | ~13.3 ms |
| Branching | median 18 · p90 126 · p99 1,114 · max 1,675 |
