# 26 — First real training run

| | |
| --- | --- |
| Status | planned |
| Package | ops (a run dir + observations) |
| Depends on | [24](24-smoke-e2e.md), [25](25-rocm-runbook.md) |
| Milestone | M7 |

## Goal

The AlphaZero "it works" moment: a promoted generation that beats pure UCT
at equal simulations, on the 2-player · long · France config.

## Design

- `runs/2p-long-france-v1/config.json` starting point:
  - gen-0: 500 games, pure UCT at ~400 sims (RolloutEvaluator), curation
    `{maxPerLevel: 24, maxMoves: 64}`;
  - gen-1+: PUCT at 200 sims with the current net, Dirichlet ε 0.25 / α 0.5,
    τ = 1 for 30 moves;
  - train: window 5, 2 epochs/gen, AdamW, cosine LR;
  - gate: 100 games at 200 sims, promote ≥ 0.55; always log vs `mcts:400`.
- Expected wall-clock (to be corrected by [08](08-benchmarks.md) numbers):
  ~1–3 s/move at 200 sims ⇒ roughly 500 games/day on 12 workers — a
  generation every 1–2 days initially. If that's too slow, pull the levers in
  README order (curation caps, sims schedule, in-worker batching) before any
  new infrastructure.
- Track per generation, in `loop-log.jsonl` and a small markdown journal in
  the run dir: gate result, win-rate vs `mcts:400`, policy top-1 agreement,
  value calibration.

## Success criteria

1. Gen-1 net's PUCT ≥ pure UCT at equal sims (sanity: the net learned
   *something* from gen-0 data).
2. Within a handful of generations, a promoted net **beats `mcts:400`
   decisively at 200 sims** — search doing less work and winning more.
3. The loop survives a week unattended (crashes resume, gates ratchet).

## Inputs

- Everything: the full pipeline (23/24) on the ROCm box (25).

## Outputs

- `runs/2p-long-france-v1/` with a promoted `best.json` — the first policy
  artifact eligible for real-time play against humans (deployment is a
  follow-on project, see README "Later").
- Updated benchmark/throughput numbers and journal feeding the next planning
  round.

## How it runs / verification

```sh
pnpm --dir agent loop --config runs/2p-long-france-v1/config.json
pnpm --dir agent arena 100 long nn:best@runs/2p-long-france-v1:200 mcts:400
```
