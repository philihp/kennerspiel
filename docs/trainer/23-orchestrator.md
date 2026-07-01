# 23 — Generation orchestrator

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [15](15-selfplay-workers.md), [16](16-shard-exporter.md), [19](19-training-loop.md), [20](20-onnx-export.md), [22](22-arena-gating.md) |
| Milestone | M6 |

## Goal

One command that runs generations unattended overnight: self-play → export →
train → export-onnx → gate → (promote) → next generation. Dies and resumes
cleanly.

## Design

- `agent/src/cli/loop.ts`, run as
  `pnpm --dir agent loop --config runs/r1/config.json [--gens N]`.
- Deliberately boring: a sequential driver that shells out
  (`child_process`) to the four stage commands — each stage stays
  independently runnable and debuggable; the orchestrator adds no logic of
  its own beyond sequencing and bookkeeping.
- `config.json` is the single source of truth: game cfg, sims, curation,
  temperature, games/gen, window K, epochs, gate threshold, workers.
- **Resume via `STATE` marker** per generation
  (`selfplay → exported → trained → gated`): on start, find the first
  incomplete stage of the latest generation and rerun it — every stage is
  itself resumable/idempotent, so "resume = rerun the same command" holds
  end-to-end.
- Non-promotion path: keep the old champion, still advance to the next
  generation (fresh data from the champion), flag the streak; ≥3 consecutive
  failed gates halts the loop for a human look.
- Prunes `shards/` of gated generations (JSONL stays).
- Appends one summary line per generation to `runs/<id>/loop-log.jsonl`
  (durations, games, loss, gate result, Elo vs yardstick).

## Inputs

- `runs/<id>/config.json`; the stage CLIs (`selfplay`, `export`, `uv run
  oel-train`, `uv run oel-export-onnx`, `arena` gate).

## Outputs

- Fully populated `gen-NNN/` directories, an updated `best.json`, and
  `loop-log.jsonl` — the run's audit trail.

## How it runs / verification

- Unit: STATE-machine transitions and resume-point selection
  (`pnpm --dir agent test`).
- Integration: the smoke run ([24](24-smoke-e2e.md)) is this command with a
  tiny config.
- Manual: kill it at each stage boundary and mid-stage; rerun; verify no
  duplicated work and no corrupted markers.
