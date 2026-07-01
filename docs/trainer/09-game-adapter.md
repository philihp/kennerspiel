# 09 — GameAdapter interface

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [02](02-engine-adapter.md)–[06](06-selfplay-v1.md) |
| Milestone | M2 |

## Goal

Make the search/self-play/training core game-blind. Adding a second Uwe-style
game should mean implementing one interface, not touching MCTS or the
trainer.

## What exists today (what gets refactored)

The agent is already layered, but the layers are hard-wired to Ora et Labora:

- `agent/src/engine.ts` — `Move = string[]`, `apply` (reducer +
  throw→undefined), `replay`, `isPlaying`, `isTerminal`, `playerToMove`
  (`frame.activePlayerIndex`, correct across WORK_CONTRACT interrupts),
  `numPlayers`, `scores` (via `control(state, []).score`), `outcome`
  (rank-based per-player vector in [0,1], **defined mid-game too** — the
  rollout score-margin cutoff in `mcts/search.ts` depends on that).
- `agent/src/moves.ts` — `enumerateMovesInfo`/`enumerateMoves` (capped DFS
  over the completion tree), `sampleMove` (random walk + apply-verify +
  capped-enumeration fallback).
- `agent/src/policy.ts` — `Policy = { name, pick(state, rng): Move |
  undefined }` — **synchronous**.
- `agent/src/policies/{random,greedy,mcts}.ts` — thin `Policy` factories over
  `sampleMove`, `enumerateMoves`+`scores`, and `search`.
- `agent/src/arena.ts` — `GameConfig`, `opening(cfg, seed)` (CONFIG/START
  command pair), synchronous `playGame` / `runMatch` (seat-alternating,
  seeded).
- `agent/src/selfplay.ts` — synchronous `selfPlayGame` recording
  per-decision `visits` keyed by raw `Move` arrays.
- `agent/src/mcts/search.ts` — synchronous UCT `search(state, rng, options)`
  importing `engine`/`moves` directly.

Every one of these imports `hathora-et-labora-game` or a sibling directly.
The refactor threads a single adapter value through instead; `engine.ts` and
`moves.ts` **stay as internal modules** that the OeL adapter delegates to.

## Design

`agent/src/game/adapter.ts`:

```ts
export type GameAdapter<TState, TMove, TCfg = unknown> = {
  name: string                                    // 'oel'
  initial(cfg: TCfg, seed: number): TState
  apply(state: TState, move: TMove): TState | undefined
  isTerminal(state: TState): boolean
  playerToMove(state: TState): number
  numPlayers(state: TState): number
  outcome(state: TState): number[]                // per-player [0,1]; defined mid-game (rollout cutoff)
  legalMoves(state: TState, caps?: Caps): TMove[] // curated, canonical, deduped
  sampleMove(state: TState, rng: Rng): TMove | undefined
  moveKey(move: TMove): string                    // canonical serialization
  heuristic?(state: TState): number[]             // per-player scalar (greedy baseline); optional

  featureSpec: FeatureSpecMeta                    // featureLen, version, offsets…
  encodeState(state: TState, perspective: number, out: Float32Array): void

  actionSpec: ActionSpec                          // see [11](11-action-encoder.md)
  encodeMove(state: TState, perspective: number, move: TMove, out: Float32Array): void
}
```

`Caps` is today's `EnumerateOpts` (`maxPerLevel`/`maxMoves`), renamed into
the adapter module. `Rng` stays the existing `agent/src/rng.ts` type.

`agent/src/game/oel.ts` implements `GameAdapter<GameState, Move, GameConfig>`
by delegation, not reimplementation:

- `initial` = `replay(opening(cfg, seed))` (moving `GameConfig`/`opening`
  from `arena.ts` into the adapter; a bad opening throws).
- `apply`/`isTerminal`/`playerToMove`/`numPlayers`/`outcome` = the `engine.ts`
  functions verbatim; `heuristic` = `scores(state).map(s => s.total)` (kept
  optional on the interface because it's a baseline convenience, not a core
  requirement for a new game).
- `legalMoves(state, caps)` = `enumerateMoves(state, caps)` piped through
  `canonicalize` + dedupe-by-`moveKey` from
  [10](10-move-canonicalization.md); until 10 lands, identity + join-space
  key.
- `encodeState` = `encodeInto` from [07](07-engine-fast-paths.md).
  `featureSpec` re-exports the game package's `featureSpec` plus a `version`
  field (the game's spec has no version yet — added here, asserted by
  [16](16-shard-exporter.md)/[21](21-onnx-evaluator.md)).
- `encodeMove`/`actionSpec` land with [11](11-action-encoder.md); until then
  the stub throws with a pointer to project 11 (nothing in M2 calls it).

**Async policies now.** `Policy.pick` becomes
`pick(state, rng): Promise<TMove | undefined>`, so the evaluator seam
([12](12-evaluator-interface.md)) and ONNX inference
([21](21-onnx-evaluator.md)) don't force a second churn through every policy,
`playGame`, `runMatch`, `selfPlayGame`, and both CLIs. The migration is
mechanical: current implementations are synchronous, so `async` + `await`
change no rng-call ordering — same seeds produce the same games.

## Implementation plan

1. **Types first** — add `agent/src/game/adapter.ts` (`GameAdapter`, `Caps`,
   `FeatureSpecMeta`, `ActionSpec` placeholder). No behavior change.
2. **OeL adapter** — add `agent/src/game/oel.ts` delegating as above; move
   `GameConfig`/`CONFIG_2P_LONG`/`CONFIG_2P_SHORT`/`opening` here (re-export
   from `arena.ts` temporarily to keep the diff reviewable).
3. **Thread the adapter, still sync** — `mcts/search.ts` takes
   `(adapter, state, rng, options)`; `policies/*` become
   `randomPolicy(adapter)`, `greedyPolicy(adapter, caps)`,
   `mctsPolicy(adapter, options)`; `arena.ts` `playGame`/`runMatch` and
   `selfplay.ts` `selfPlayGame` take the adapter. Generic in
   `<TState, TMove>` throughout; `Move`-typed imports from `engine.ts`
   disappear from these files.
4. **Async flip in one commit** — `Policy.pick` → `Promise`; `playGame` loop
   awaits `policy.pick`; `runMatch`'s `range(...).map(...)` becomes a
   sequential `for` loop (deterministic order preserved); `selfPlayGame` →
   async; `cli/arena.ts` and `cli/selfplay.ts` top-level `await`. `search()`
   itself stays synchronous until PUCT ([13](13-puct-search.md)) needs the
   async evaluator.
5. **Tests** — update `agent/src/__tests__/{engine,moves,mcts,arena}.test.ts`
   mechanically (adapter arg + `await`); add the golden-game regression
   (below) *before* steps 3–4 so the refactor is pinned by it.

## Migration / back-compat

- `engine.ts` and `moves.ts` keep their exports; only their *callers* change.
  Their own unit tests keep passing untouched.
- Seeded determinism is the contract: the golden test records, for a couple
  of seeds, the full command list of `playGame(random vs random)` and a
  `selfPlayGame` at tiny sims **before** the refactor, and asserts identity
  after. Awaiting already-resolved promises does not reorder rng draws.
- JSONL from [06](06-selfplay-v1.md) is unaffected (same `Decision` shape);
  key stability changes arrive with [10](10-move-canonicalization.md) /
  [14](14-selfplay-v2.md).

## Inputs

- The existing agent modules (02–06) and the game package (07 exports:
  `encodeInto`, `scores`, `completions`).

## Outputs

- `agent/src/game/adapter.ts` (types), `agent/src/game/oel.ts` (the one
  concrete adapter), and refactored call sites throughout `agent/src/`
  (search, policies, arena, selfplay, CLIs) — all generic over
  `<TState, TMove>`.

## How it runs / verification

- `pnpm --dir agent test && pnpm --dir agent typecheck` — the entire existing
  suite passes through the adapter with **identical seeded behavior** (same
  seeds ⇒ same command lists as before the refactor); the golden-game
  regression test pins this.
- Grep-level check: nothing under `agent/src/` outside `game/` and
  `engine.ts`/`moves.ts` imports `hathora-et-labora-game`.
- A 10-game `pnpm --dir agent arena` smoke run matches pre-refactor results
  for the same seeds.

## Design notes & tradeoffs

- **Generic `TState`/`TMove` type params vs concrete types.** Concrete
  `GameState`/`string[]` everywhere would be less ceremony, but then "game-
  agnostic" is a comment, not a compiler guarantee — the whole point of M2 is
  that search/selfplay *cannot* reach into OeL specifics. Generics cost a few
  type parameters on `search`/`playGame` signatures and nothing at runtime.
  `TCfg` defaults to `unknown` so the core never inspects configs. Chosen:
  generics, with `oel.ts` as the only place the concrete types appear.
- **Adapter as object-of-functions vs class.** A class invites inheritance
  and `this`-state; the adapter is a bag of pure functions plus two constant
  specs, exactly what a plain object literal expresses. It also matches the
  existing house style (`Policy` is already an object literal) and keeps
  `oel.ts` trivially tree-shakeable. Chosen: object type.
- **Policies async now (one churn) vs later (double churn).** Making `pick`
  async today touches every policy, `playGame`, `runMatch`, `selfPlayGame`,
  and the CLIs — but the edits are `async`/`await` insertions with zero
  behavioral risk while everything underneath is still synchronous, and the
  golden test proves it. Deferring means re-touching the same files in
  [12](12-evaluator-interface.md)/[13](13-puct-search.md) when the change is
  *not* behaviorally trivial (real awaits interleave). Chosen: now. `search()`
  is the one exception — it stays sync until 13 replaces it, so pure-UCT hot
  loops don't pay promise overhead for nothing.
- **Keep `engine.ts`/`moves.ts` as internal modules vs inlining into
  `oel.ts`.** Inlining would make `oel.ts` the single source of truth but
  produce a 300-line file mixing concerns and churning tests that target the
  modules directly. Delegation keeps the diff small and the modules
  independently testable; if a second game ever lands, its adapter gets its
  own internal modules the same way. Chosen: delegate.
- **`outcome()` defined mid-game vs terminal-only.** AlphaZero formally only
  needs terminal outcomes, but the current rollout cutoff
  (`mcts/search.ts`) evaluates non-terminal states by score rank, and gen-0
  self-play depends on it. Encoding that contract in the adapter (documented
  on the `outcome` field) beats adding a second `evaluateHeuristically`
  method; `heuristic?` exists separately only because greedy wants a raw
  score, not a rank.
