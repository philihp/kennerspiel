# 13 — PUCT search

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [09](09-game-adapter.md), [12](12-evaluator-interface.md) |
| Milestone | M4 |

## Goal

AlphaZero-style search: evaluator-driven leaf evaluation with policy priors
guiding selection, replacing (but preserving as an option) rollout
evaluation.

## Design

`agent/src/mcts/puct.ts` (new; `search.ts` stays as the sync UCT reference):

- Node expansion: `adapter.legalMoves()` once, encode state + every candidate,
  one `evaluate()` call → per-player `value` vector and softmax `priors`
  aligned to the candidate list.
- Selection: `argmax_a Q(s,a)[mover] + cPuct · P(a) · √N / (1 + n(a))`, with
  the per-player vector backup kept unchanged from project 05 (multiplayer +
  interrupt correctness).
- **Root Dirichlet noise**: `P ← (1−ε)·P + ε·Dir(α)`, ε = 0.25,
  α ≈ 10/⟨branching⟩ ≈ 0.5 — self-play exploration only, off for arena play.
- **Virtual loss** on in-flight paths, so Stage-2 evaluator batching can run
  several simulations concurrently without collapsing onto one path.
- Async throughout (`await evaluator.evaluate(…)`).
- **Complete visit output**: the result carries the *full canonical candidate
  list with visit counts, zeros included* — project 05 reports only expanded
  edges, which breaks policy-target support. Training needs the whole softmax
  support.

```ts
puct(state, rng, { sims, cPuct=1.5, dirichlet?, curation? }, evaluator)
  → { best, candidates: TMove[], visits: number[], q: number[] }
```

## Inputs

- Root state, seeded `Rng`, options, an `Evaluator`
  (RolloutEvaluator ⇒ gen-0 behavior; OnnxEvaluator ⇒ NN generations).

## Outputs

- `puct()` search function + an async `puctPolicy` wrapper for the arena.

## How it runs / verification

- `pnpm --dir agent test` — seeded determinism; visits sum to sims; candidate
  list matches `adapter.legalMoves` exactly.
- Strength sanity via arena: PUCT with `RolloutEvaluator` (uniform priors) ≈
  UCT at equal sims against `random`/`greedy` — the refactor must not lose
  strength before the net adds any.
