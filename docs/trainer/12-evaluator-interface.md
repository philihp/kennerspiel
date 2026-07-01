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
export type EvalRequest = {
  state: Float32Array        // encoded via adapter.encodeState
  candFeats: Float32Array    // numCands × moveFeatureLen, adapter.encodeMove
  numCands: number
}
export type EvalResult = { value: number[]; priors: number[] }
export type Evaluator = {
  id: string                 // recorded in JSONL (netId) for provenance
  evaluate(reqs: EvalRequest[]): Promise<EvalResult[]>
}
```

- **Async and batched from day one** (an array of requests), even though the
  first implementation is synchronous under the hood — this is what makes
  in-worker cross-game batching (Stage 2) and a GPU server (Stage 3) drop-in
  later.
- `RolloutEvaluator(adapter, { rolloutDepth })`: value = depth-capped random
  rollout + `outcome()` (exactly project 05's evaluation), priors = uniform.
  Gen-0 self-play and NN generations share one search code path.
- Staging plan: Stage 1 = `OnnxEvaluator` per worker, CPU
  ([21](21-onnx-evaluator.md)); Stage 2 = in-worker leaf batching across
  concurrent games (only if profiling shows NN-bound search); Stage 3 =
  Python GPU inference server behind this same interface (only if measured
  necessary — do not build speculatively).

## Inputs

- Encoded state + candidate tensors from the adapter.

## Outputs

- `Evaluator` type, `RolloutEvaluator` implementation.

## How it runs / verification

- `pnpm --dir agent test` — `RolloutEvaluator` is deterministic under a
  seeded Rng; priors sum to 1; value components lie in [0,1].
