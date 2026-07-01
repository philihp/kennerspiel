# 09 — GameAdapter interface

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [02](02-engine-adapter.md)–[06](06-selfplay-v1.md) |
| Milestone | M2 |

## Goal

Make the search/self-play/training core game-blind. Adding a second
Uwe-style game should mean implementing one interface, not touching MCTS or
the trainer.

## Design

`agent/src/game/adapter.ts`:

```ts
export type GameAdapter<TState, TMove> = {
  name: string                                   // 'oel'
  initial(cfg: unknown, seed: number): TState
  apply(state: TState, move: TMove): TState | undefined
  isTerminal(state: TState): boolean
  playerToMove(state: TState): number
  numPlayers(state: TState): number
  outcome(state: TState): number[]               // per-player [0,1]
  legalMoves(state: TState, caps?: Caps): TMove[] // curated, canonical, deduped
  sampleMove(state: TState, rng: Rng): TMove | undefined
  moveKey(move: TMove): string                   // canonical serialization

  featureSpec: FeatureSpecMeta                   // featureLen, version, offsets…
  encodeState(state: TState, perspective: number, out: Float32Array): void

  actionSpec: ActionSpec                         // see project 11
  encodeMove(state: TState, perspective: number, move: TMove, out: Float32Array): void
}
```

- `agent/src/game/oel.ts` implements it by delegating to the existing
  `engine.ts` / `moves.ts` (kept as internal modules) and to `encodeInto`
  from [07](07-engine-fast-paths.md). `legalMoves` folds in canonicalization
  ([10](10-move-canonicalization.md)); `encodeMove` lands with
  [11](11-action-encoder.md) (stubbed until then).
- Search, policies, arena, and self-play take an adapter instead of importing
  `engine.ts` directly. Policies become async
  (`pick(state, rng): Promise<TMove | undefined>`) now, so the evaluator seam
  ([12](12-evaluator-interface.md)) doesn't force a second churn.

## Inputs

- The existing agent modules (02–06) and the game package.

## Outputs

- `adapter.ts` (types), `oel.ts` (the one concrete adapter), and refactored
  call sites throughout `agent/src/`.

## How it runs / verification

- `pnpm --dir agent test` — the entire existing suite passes through the
  adapter with **identical seeded behavior** (same seeds ⇒ same games as
  before the refactor); a golden-game regression test pins this.
