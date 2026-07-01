# 07 — Engine fast paths

| | |
| --- | --- |
| Status | planned |
| Package | `game/` |
| Depends on | [01](01-state-encoder.md) |
| Milestone | M1 |

## Goal

Remove the known per-simulation hot-path costs in the engine's public API and
export the helpers the action encoder needs. This is the single
highest-leverage search speedup available, because the agent currently reaches
everything through `control()`, which does far more work than the agent reads.

## What the code does today

`control(state, partial, player?)` in `game/src/control.ts` returns
`{ active, flow, partial, completion, score }` and computes **all** of it on
every call:

- **`completion`** — a `ts-pattern` `match(head(partial))` dispatch: for
  `undefined` it concatenates all twelve `complete*(state)([])` calls (from
  `game/src/commands/index.ts`, in the fixed order USE, BUILD, CUT_PEAT,
  FELL_TREES, WORK_CONTRACT, BUY_PLOT, BUY_DISTRICT, CONVERT, SETTLE,
  WITH_LAYBROTHER, WITH_PRIOR, COMMIT), returning `[]` when
  `status === FINISHED`; for a known command head it calls that command's
  `complete*(state)(partial)`; otherwise `[]`.
- **`flow`** — `computeFlow()`, a bounded frame-walk (`limit = 200`) over
  `pickFrameFlow(config)` that allocates a `Flower` object per upcoming frame,
  including `introduced` building lists. Only the web UI reads this.
- **`score`** — per real player (neutral player sliced off), `goodsPoints`
  (whose `optimalCashPoints` brute-forces up to a 5×5 wine/whiskey grid via
  `lift`), `allBuildingPoints`, and `allDwellingPoints` — two full landscape
  scans plus per-settlement adjacency sums.

The agent's move enumeration (`agent/src/moves.ts`) calls
`control(state, partial).completion` **once per node of a DFS over the
completion tree** — hundreds of calls per enumeration on branchy states — and
throws away `flow` and `score` every time. Worse, `agent/src/engine.ts`
`scores()` is implemented as `control(state, []).score`, so every rollout
cutoff and terminal `outcome()` in MCTS pays for a **full top-level completion
enumeration** just to read the score. Both directions of waste get fast paths.

On the encoder side, `encode()` in `game/src/encode.ts` allocates a fresh
`Float32Array(FEATURE_LEN)` (~57 KB) per call even though the internal
`Writer` class already writes positionally into a caller-supplied buffer; and
`erectionId()` does `indexOf` over `GENERIC_BUILDINGS` (72 entries) or
`SETTLEMENT_TYPES` per occupied tile, per encode, while the sibling lookups
(`buildingMaskIndex`, `settlementHandIndex`) already use precomputed `Map`s.

## Implementation plan

All changes in `game/`; agent call sites migrate in [08](08-benchmarks.md) /
[09](09-game-adapter.md).

1. **`completions()`** — in `game/src/control.ts`, extract the existing
   `match(head(partial))` block verbatim (including the `FINISHED → []` guard
   and the twelve-command concatenation order, which parity tests pin):

   ```ts
   export const completions = (state: GameState, partial: string[] = []): string[]
   ```

2. **`scores()`** — extract the score block from `control()` unchanged:

   ```ts
   export const scores = (state: GameState): Score[]
   ```

3. **Reimplement `control()` on top of both** with no behavior change:
   `{ active, flow: computeFlow(state), partial, completion:
   completions(state, partial), score: scores(state) }`. `control()` keeps its
   exact signature and output; the web UI and MCP tools
   (`web/src/context/InstanceContext.ts`, `web/src/mcp/tools/*.ts`) are
   untouched.

4. **`encodeInto()`** — in `game/src/encode.ts`:

   ```ts
   export const encodeInto = (
     state: GameState,
     perspective: number | undefined,
     out: Float32Array,
     offset = 0
   ): void
   ```

   - Throw `RangeError` if `out.length < offset + FEATURE_LEN`.
   - **`out.fill(0, offset, offset + FEATURE_LEN)` first.** The `Writer`
     relies on zero-initialized memory (`hot`/`bits` only set 1s, `skip`
     writes nothing), so a reused scratch buffer must be cleared or stale
     values leak through skipped player blocks and one-hot gaps.
   - `SETUP` status: zero-fill and return (mirrors `encode`'s early return).
   - Start the `Writer` at `offset` (its `pos` field is already public; pass
     it via constructor or assignment).
   - `encode(state, perspective?)` becomes the two-line wrapper: allocate
     `Float32Array(FEATURE_LEN)`, `encodeInto`, return.

5. **Erection-id lookup Map** — replace the `indexOf` chains in `erectionId`
   with a `Map<ErectionEnum, number>` built at module load from `BUILDINGS`
   and `SETTLEMENTS` (same pattern as `buildingMaskIndex`). `erectionId(e) =
   map.get(e) ?? 0` — identical output for every enum value including the
   unknown→0 fallback (today `indexOf` returns −1 and `+1` yields 0).

6. **Country capacity in the encoder** — the shared block's country one-hot
   is currently exactly `COUNTRIES.length = 2` wide, so adding a third
   country would change `FEATURE_LEN` and strand every trained checkpoint.
   More countries are a stated plan, and right now zero trained weights
   exist — this is the one moment a `FEATURE_LEN` change is free. Widen the
   config country field to a reserved `COUNTRY_CAPACITY = 8` (same
   append-only pattern as the 256-slot erection vocab; the country list in
   `featureSpec.vocab.countries` stays the source of truth for live ids) and
   bump the featureSpec version. `config.players` (max 4) and `length` (2)
   are closed sets and stay exact-size.

7. **Exports** — from `game/src/index.ts`, additive only: `completions`,
   `scores`, `encodeInto`, `erectionId`, and `parseResourceParam` (from
   `game/src/board/resource.ts`). Exporting `parseResourceParam` requires also
   exporting the `Cost` type (and `ResourceEnum`, useful for
   [11](11-action-encoder.md)); neither is exported today.

8. **Version bump** — `hathora-et-labora-game` is published (currently
   `0.21.1`); this is additive except the `FEATURE_LEN` change in step 6
   (nothing ships trained weights yet, so it is safe now and never again);
   bump minor → `0.22.0`.

## Edge cases

- `completions(state, ['NOT_A_COMMAND'])` must return `[]` (the `.otherwise`
  arm), same as `control` today.
- `completions` with a `FINISHED` state and non-empty partial: today the
  command-specific arms still run; preserve that (only the `undefined` head
  short-circuits on `FINISHED`).
- `encodeInto` at a non-zero `offset` into a buffer sized for several states
  (the [16](16-shard-exporter.md) use case) — covered by an explicit test.
- `scores()` on a 1-player config still slices the neutral player off
  (`slice(0, config.players)`), exactly as inside `control()`.

## Inputs

- Existing `control.ts` / `encode.ts` internals; fixture games under
  `game/src/__tests__/` (`game21872.test.ts`, `game4aedf9e5.test.ts`, …) for
  parity states.

## Outputs

- New exports from `hathora-et-labora-game`: `completions`, `scores`,
  `encodeInto`, `erectionId`, `parseResourceParam` (+ `Cost`, `ResourceEnum`
  types).
- Country one-hot widened to `COUNTRY_CAPACITY = 8` (new `FEATURE_LEN`,
  featureSpec version bump) so future countries never change shapes again.
- A minor version bump of the package (`0.21.1` → `0.22.0`); `control()` and
  `encode()` behavior otherwise unchanged.

## How it runs / verification

- `pnpm --dir game test` — new parity suite (`game/src/__tests__/`):
  - Replay fixture games; at every intermediate state assert
    `completions(state, []) ≡ control(state, []).completion` and
    `scores(state) ≡ control(state, []).score` (deep equality, order
    included), plus the same over partials reached by a capped DFS drill-down
    (so command-specific arms are exercised, not just the top level).
  - `encodeInto` into a fresh buffer equals `encode` byte-for-byte for every
    fixture state and each perspective; `encodeInto` into a NaN-poisoned
    scratch buffer equals `encode` (proves the `fill(0)`); offset variant
    writes exactly `[offset, offset + FEATURE_LEN)` and nothing outside it.
  - `erectionId` over every `BuildingEnum`/`SettlementEnum` value matches the
    old `indexOf` implementation (table test).
- Benchmark ([08](08-benchmarks.md)) then shows `completions()` ≫
  `control()` (expect ~5–10× on enumeration-heavy states, since flow + score
  dominate the 0.33 ms baseline), `scores()` ≫ `control().score`, and
  `encode`/`encodeInto` ≤ 0.5 ms.
- Agent migration (with 08/09): `moves.ts` switches
  `control(state, partial).completion ?? []` → `completions(state, partial)`;
  `engine.ts` `scores()` switches to the game's `scores` export.

## Design notes & tradeoffs

- **Parallel `completions()` vs an options param on `control()` vs caching
  flow.** An options bag (`control(state, partial, player, { skipFlow })`)
  keeps one entry point but changes the published `Controls` shape
  conditionally — every existing consumer must now handle possibly-absent
  `flow`/`score`, and the type either lies or splits. Caching `computeFlow`
  per state object (WeakMap) helps the web but not the agent, whose states
  are all fresh objects from `reducer`. A parallel function is dumb, additive,
  and lets `control()` be *defined* in terms of it, so parity is structural
  rather than tested-for. Chosen: parallel functions.
- **Exporting internals (`parseResourceParam`, `erectionId`, `scores`) vs
  re-implementing in `agent/`.** Duplication would let the game package keep a
  minimal surface, but [11](11-action-encoder.md) must agree with the engine
  exactly (payment multisets, embedding ids shared with the state grid) — a
  re-implementation that drifts (e.g. the `Po`/`Ho` legacy aliases in
  `parseResourceParam`) silently corrupts training targets. Coupling to the
  package that already owns these semantics is the safer failure mode; the
  exports are small and stable. Chosen: export.
- **Map vs `indexOf` for `erectionId`.** The vocab arrays are small (72 + 8),
  so a single lookup is cheap either way; but `erectionId` runs per occupied
  tile per encode (~hundreds of times per call at 38×9 per player), and the
  codebase already established the Map pattern for the two mask indexes.
  Micro-win, zero risk, consistency win. Chosen: Map.
- **`encodeInto` argument order.** `(state, perspective, out, offset?)`
  mirrors `encode(state, perspective)` and matches the adapter's
  `encodeState(state, perspective, out)` ([09](09-game-adapter.md));
  `perspective` stays explicit (pass `undefined` for the default) rather than
  trailing-optional, so the exporter can't silently encode from the wrong
  seat.
- **Semver for the published package.** Everything here is additive and
  `control()`/`encode()` outputs are bit-identical, so a minor bump (0.22.0)
  is honest. In 0.x land some tools treat minor as breaking — acceptable; the
  in-repo consumers (`web/`, `agent/`) use `workspace:*` anyway. What we must
  *not* do is change `control()`'s shape or the completion-token grammar here;
  that is why move canonicalization ([10](10-move-canonicalization.md)) lives
  in `agent/` instead.
