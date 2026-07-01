# 02 — Engine adapter

| | |
| --- | --- |
| Status | ✅ done (`agent/src/engine.ts`, `agent/src/rng.ts`) |
| Package | `agent/` |
| Depends on | — |

## Goal

A thin, typed seam between the published game engine and everything the
trainer builds, so search/self-play code never touches raw engine calls and
error handling lives in one place. Later folded behind the game-agnostic
`GameAdapter` ([09](09-game-adapter.md)) without changing callers' semantics.

## Design

### Exported surface (`agent/src/engine.ts`)

```ts
export type Move = string[]                 // one complete command
export { initialState }                     // re-exported from the engine

apply(state: GameState, move: Move): GameState | undefined
replay(commands: Move[]): GameState | undefined
isPlaying(state): boolean                   // status === PLAYING
isTerminal(state): boolean                  // status === FINISHED
playerToMove(state): number                 // frame.activePlayerIndex
numPlayers(state): number                   // config.players
scores(state): Score[]                      // control(state, []).score
outcome(state): number[]                    // per-player value in [0, 1]
```

- **`Move = string[]`** is one complete command exactly as the reducer takes
  it, e.g. `['USE','LR2']`, `['BUILD','G07','3','2']`, `['COMMIT']`.
- **`apply`** wraps `reducer` in try/catch: unparseable commands (the reducer
  throws) and ordinary illegal moves both normalize to `undefined`. No other
  code in `agent/` calls `reducer` directly.
- **`replay`** left-folds `apply` from `initialState`; any failing command
  makes the whole replay `undefined` (it does not identify *which* command
  failed — cheap and sufficient for search/self-play, where a failure is a
  bug upstream).
- **`playerToMove`** is `frame.activePlayerIndex`, which differs from
  `currentPlayerIndex` only during interrupts (e.g. `WORK_CONTRACT`, where an
  opponent must answer mid-turn). Search keys nodes off this.
- **`numPlayers`** reads `config.players` rather than `players.length`
  because the tableau array can include a neutral player (solo variant).
- **`scores`** delegates to `control(state, [])` and reads `.score` — valid
  mid-game and at terminal. This also pays for `control`'s `computeFlow`
  frame-walk, which enumeration/search never read; that overhead is exactly
  what [07](07-engine-fast-paths.md) removes.
- **`outcome`** maps score totals to a per-player rank vector:
  `(#opponents beaten + 0.5 · #ties) / #opponents`, i.e. 2p → win 1 /
  draw 0.5 / loss 0. Solo (`n === 1`) returns the raw score total, since
  there is no opponent to rank against — **a known contract violation**: the
  raw score (hundreds of points) breaks the `[0,1]` scale that UCT's
  exploration constant and the sigmoid value head assume. The adapter
  ([09](09-game-adapter.md)) remaps solo to `σ((score − 500)/100)`, anchored
  on the solo success criterion (score > 500 ⇒ value > 0.5). Because it
  ranks *current* totals, `outcome` is meaningful on non-terminal states
  too — [05](05-uct-search.md) uses this as its rollout score-margin cutoff.

### RNG (`agent/src/rng.ts`)

```ts
export type Rng = () => number              // float in [0, 1)
mulberry32(seed: number): Rng
randInt(rng, n): number
choice<T>(rng, xs: readonly T[]): T
```

mulberry32 is a 32-bit state PRNG: one add, two `Math.imul` mixes, a few
shifts per draw. Everything downstream (rollouts, arena scheduling, self-play)
takes an `Rng` parameter and never touches `Math.random`, so a seed fully
determines a game.

### Edge cases

Handled: throwing reducer, illegal moves, interrupts, neutral player, solo
outcome, ties. Not handled: `playerToMove`/`numPlayers`/`scores` assume a
post-`START` state (`frame!`/`config!` non-null assertions) — calling them on
a SETUP state is a caller bug; `replay` gives no diagnostics on failure.

## Design notes & tradeoffs

- **`Move` as `string[]` vs structured objects.** Chosen: the engine's own
  token format. Zero translation layers, trivially JSON-serializable for the
  self-play logs, and `control()`'s completion tokens concatenate directly
  into moves ([03](03-move-enumeration.md)). Cost: no type safety over move
  contents and no cheap structural equality — string-keyed canonicalization
  is deferred to [10](10-move-canonicalization.md), and typed encoding to
  [11](11-action-encoder.md).
- **Returning `undefined` vs throwing.** Chosen: `undefined` for both
  unparseable and illegal moves. Search probes moves speculatively thousands
  of times per decision; exceptions as control flow would be slow and force
  try/catch into every hot loop. Cost: the two failure kinds are
  indistinguishable and silent — tests compensate by asserting enumerated
  moves always apply.
- **Rank-based `[0,1]` outcome vs raw score margin vs zero-sum ±1.** Chosen:
  rank-based. It generalizes unchanged to 3–4 players (a per-player vector,
  not a scalar), keeps UCT's exploration term on a known value scale, and is
  robust to the game's large, config-dependent score ranges. Raw margin would
  reward point-piling long after the win is decided and needs
  per-config normalization; strict zero-sum ±1 doesn't extend to multiplayer.
  Cost: throws away margin information (a 1-point win equals a 40-point win),
  which weakens the rollout-cutoff signal in lopsided positions — accepted,
  and revisited only if value targets prove noisy.
- **mulberry32 vs PCG (or xoshiro).** Chosen: mulberry32. ~5 integer ops per
  draw, 32-bit state, trivially embeddable, and statistically far better than
  needed for move sampling; the engine itself already uses PCG internally for
  game setup, where stream quality matters more. Cost: small state/period and
  no stream splitting — mitigated by deriving independent seeds per game
  (`seed * 7919 + k` in the arena/self-play CLIs).
- **Wrapping the engine at all vs calling it directly.** One place to
  normalize errors and semantics (`activePlayerIndex`, `config.players`) and
  a surface small enough that [09](09-game-adapter.md) can later swap the
  engine without touching search. Cost: a one-file indirection.

## Inputs

- The `hathora-et-labora-game` package: `reducer`, `control`, `initialState`,
  `GameStatusEnum`.

## Outputs

- The exported functions above, consumed by [03](03-move-enumeration.md)–
  [06](06-selfplay-v1.md).

## How it runs / verification

- Library code — consumed by 03–06 and later folded behind the `GameAdapter`
  (09).
- `pnpm --dir agent test` — `__tests__/engine.test.ts` covers: `apply`
  advancing a CONFIG command; `undefined` (not a throw) for a nonsense
  command; replaying an opening into a PLAYING 2-player state;
  `playerToMove ≡ frame.activePlayerIndex`; `scores` returning one numeric
  breakdown per non-neutral player; `outcome` shape, `[0,1]` bounds, and the
  2-player components summing to 1. Determinism (same seed ⇒ same game) is
  exercised end-to-end by the moves/MCTS tests rather than here.
