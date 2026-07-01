# 12 — Evaluator interface

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [09](09-game-adapter.md) |
| Milestone | M4 |

## Goal

One async seam through which PUCT gets leaf values and priors, so rollouts
(gen-0), CPU ONNX inference, and a future GPU batch server are
interchangeable without touching search code.

## Design

`agent/src/evaluator.ts`:

```ts
export type EvalRequest<TState, TMove> = {
  state: TState              // the raw game state at the leaf
  perspective: number        // adapter.playerToMove(state)
  candidates: TMove[]        // canonical list from adapter.legalMoves — priors align to this
}
export type EvalResult = {
  value: number[]            // per-player, ABSOLUTE seat order, each in [0, 1]
  priors: number[]           // length === candidates.length, sums to 1
}
export type Evaluator<TState, TMove> = {
  id: string                 // recorded in JSONL (netId) for provenance
  evaluate(reqs: EvalRequest<TState, TMove>[]): Promise<EvalResult[]>
}
```

Two contracts worth spelling out because they are classic bug sources:

- **Value order is absolute seat order** (index = player index, exactly what
  `outcome()` in `agent/src/engine.ts` returns), *not* rotated to the
  perspective. Evaluators whose model output is egocentric (slot 0 = mover,
  per the state encoder) must rotate back using `perspective` before
  returning. PUCT's per-player backup indexes `value[mover]` at every node
  on the path, so a rotation bug corrupts every backup silently.
- **Requests carry raw state + moves, not tensors.** Encoding happens
  *inside* evaluators that need it (the adapter is injected at
  construction). Rationale: `RolloutEvaluator` physically needs the state
  object to call `sampleMove`/`apply` — a `Float32Array` is useless to it —
  and gen-0 should not pay ~57 KB of state encoding plus 91 floats × up to
  128 candidates per expansion for tensors nobody reads. `OnnxEvaluator`
  ([21](21-onnx-evaluator.md)) calls `adapter.encodeState`/`encodeMove`
  into reused scratch buffers; a future GPU server still encodes Node-side
  and ships tensors, so nothing about Stage 3 changes.

### RolloutEvaluator

`RolloutEvaluator(adapter, rng, { rolloutDepth = 30 })` — per request:

- **value**: exactly project [05](05-uct-search.md)'s leaf evaluation
  (`rollout()` in `agent/src/mcts/search.ts`): loop `sampleMove` → `apply`
  up to `rolloutDepth` commands or terminal, breaking on `undefined` from
  either (same guards), then `adapter.outcome(s)` — which on a non-terminal
  state ranks by current score totals, the score-margin cutoff that lets
  rollouts stay shallow.
- **priors**: uniform `1 / candidates.length`.
- Processes the request array sequentially with the evaluator's own seeded
  `Rng`, so results are deterministic given (seed, request sequence). Gen-0
  self-play and NN generations share one search code path.

Malformed results are search-fatal by design: PUCT asserts
`priors.length === candidates.length` and finite values, and lets a rejected
`evaluate()` propagate (the self-play worker catches per game —
[15](15-selfplay-workers.md)); a half-evaluated tree must never back up.

### Staging plan

Stage 1 = `OnnxEvaluator` per worker, CPU ([21](21-onnx-evaluator.md)).
Stage 2 = in-worker leaf batching across concurrent simulations/games (only
if profiling shows NN-bound search — the interface already takes request
arrays, so this is an evaluator + `concurrency` option change, not a search
change). Stage 3 = Python GPU inference server behind this same interface
(only if measured necessary — do not build speculatively).

## Inputs

- Leaf states + canonical candidate lists from the adapter
  ([09](09-game-adapter.md)); encoded tensors are produced internally by
  evaluators that need them.

## Outputs

- `Evaluator` / `EvalRequest` / `EvalResult` types, `RolloutEvaluator`
  implementation.

## How it runs / verification

- `pnpm --dir agent test` —
  - `RolloutEvaluator` is deterministic under a seeded Rng; priors sum to 1;
    value components lie in [0,1];
  - parity: on a fixture state, its value matches project 05's `rollout()`
    given the same seed (guards the "same search behavior at gen-0" claim);
  - absolute-order contract: a nearly-won fixture position yields
    `value[leader] > value[trailer]` regardless of `perspective`.

## Design notes & tradeoffs

- **Batched-async now vs per-leaf sync**: the sync version reads slightly
  better (`const {value, priors} = evaluator.evaluate(req)`) and avoids
  async plumbing in the sim loop. But the cost of async is one microtask
  per expansion — noise next to a single `control()` call — while the cost
  of sync is refitting the `Evaluator` type, `puct.ts`, and every test
  exactly when Stage-2 batching or a GPU server is needed, i.e. when the
  system is under load and regressions are most expensive. Policies already
  go async in [09](09-game-adapter.md) for this reason. Chosen: async,
  array-in/array-out from day one; first implementation is synchronous
  under the hood.
- **Uniform priors vs cheap heuristic priors** for gen-0: a hand heuristic
  (boost `USE`/`BUILD`, score-delta greedy priors) would sharpen gen-0
  search, but (a) it injects hand-tuned bias into the very data meant to
  bootstrap the net — the net then learns the heuristic's blind spots as
  ground truth; (b) it is a second scoring code path to maintain and A/B;
  (c) M4's gate is "PUCT + uniform priors ≈ UCT at equal sims", which
  uniform satisfies by construction. If gen-1 gating fails, raising gen-0
  sims is an unbiased, measurable lever. Chosen: uniform; revisit only on
  evidence.
- **Raw state in the request vs pre-encoded tensors**: covered above —
  tensors would make the interface look "ML-native" but force the wrong
  party to pay encoding costs and make `RolloutEvaluator` impossible
  without carrying the state anyway. The adapter-injection pattern keeps
  the request game-generic (`TState`/`TMove` type params, no OeL types).
