# 22 — Arena gating & promotion

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [04](04-baselines-arena.md), [21](21-onnx-evaluator.md) |
| Milestone | M6 |

## Goal

Only nets that demonstrably beat the current champion get to generate the
next generation's data — the flywheel's ratchet.

## Design

- Extend the arena CLI's policy specs with
  `nn:<onnx-path | best@runs/<id>>[:sims]`:

```sh
pnpm --dir agent arena 100 long nn:runs/r1/gen-003/model.onnx:200 nn:best@runs/r1:200
pnpm --dir agent arena 50  long nn:best@runs/r1:400 mcts:400     # the yardstick
```

- `nn:` builds a PUCT policy with an `OnnxEvaluator`, **no Dirichlet noise**,
  argmax move selection (τ→0) — evaluation, not exploration.
- Gate procedure (invoked by the orchestrator, [23](23-orchestrator.md)):
  candidate vs `best.json`'s champion, ≥100 games, seats alternated
  (`runMatch` already does this), fixed seed schedule.
  **Promote on win-rate ≥ 0.55**; on promotion, update `runs/<id>/best.json`
  `{ gen, onnx, ckpt, arena }`. SPRT early stopping is a later nicety.
- Gen-1 special case: the champion is pure UCT (`mcts:<sims>`) until the
  first net is promoted.
- Always also log (not gate on) candidate vs `mcts:400` — the fixed-strength
  yardstick that shows absolute progress across the whole run; promoted-vs-
  promoted only shows relative progress.

## Inputs

- Candidate `model.onnx`, `best.json`, gate params from `config.json`
  (games, sims, threshold).

## Outputs

- `gen-NNN/arena.json` (full match record); updated `best.json` on
  promotion; `STATE` → `gated`.

## How it runs / verification

- `pnpm --dir agent test` — spec parsing (`nn:`), promotion threshold logic,
  best.json update atomicity (write-temp-rename).
- Determinism: same seeds ⇒ same match outcome, so gates are auditable.
