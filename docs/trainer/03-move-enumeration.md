# 03 — Move enumeration & sampling

| | |
| --- | --- |
| Status | ✅ done (`agent/src/moves.ts`) |
| Package | `agent/` |
| Depends on | [02](02-engine-adapter.md) |

## Goal

Turn the engine's token-by-token legal-move oracle into (a) a curated list of
complete legal moves for search expansion, and (b) a cheap random complete
move for rollouts.

## Design

The engine builds moves interactively: `control(state, partial).completion`
returns legal next tokens, `''` marking a complete command. Legal *full moves*
are therefore a DFS over the completion tree.

- `enumerateMoves(state, { maxPerLevel?, maxMoves? })` — DFS with curation
  caps. Branching is median 18 but p99 1,114 / max ~1,675 (SETTLE/USE
  resource-payment combinatorics), so caps are load-bearing: `maxPerLevel`
  bounds tokens explored per tree level (random subset), `maxMoves` hard-caps
  the result. Defaults for search: `{ maxPerLevel: 24, maxMoves: 128 }`.
- `sampleMove(state, rng, maxDepth?)` — random walk down the completion tree,
  no enumeration; retries on dead ends, falls back to capped enumeration.
  This is the rollout workhorse.

## Inputs

- A `GameState`; `control()` from the engine (later the `completions()` fast
  path from [07](07-engine-fast-paths.md)); an `Rng`; curation caps.

## Outputs

- `enumerateMoves(state, opts): Move[]` — legal complete commands, curated.
- `sampleMove(state, rng, maxDepth?): Move | undefined`.

## How it runs / verification

- Library code — consumed by 05, 10, and the adapter (09).
- `pnpm --dir agent test` — `__tests__/moves.test.ts`: every enumerated move
  applies cleanly via `reducer`; sampling is deterministic under a seeded Rng;
  caps are respected on fat-tail states.
