# 11 — ActionSpec & move feature encoder

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [07](07-engine-fast-paths.md), [10](10-move-canonicalization.md) |
| Milestone | M3 |

## Goal

A fixed-length feature vector per *move*, so the policy head can score any
enumerated candidate. This is the design decision that makes full AlphaZero
tractable here.

## Why move-scoring (and not the alternatives)

The numbers below are from the code, not estimates. `GameCommandEnum`
(`game/src/types.ts`) has **14 commands**; `allResource`
(`game/src/board/resource.ts`) lists **22 goods** (`ResourceEnum` has 24
tokens, but `Bp`/`Jo` are not goods — `parseResourceParam` drops them); the
color-collapsed erection vocabulary in `game/src/encode.ts` is **80 ids**
(72 generic buildings + 8 settlement types, id 0 = empty).

- **Flat indexed action space**: a full move is (command, erection, col, row,
  payments…). Even ignoring payments, command × erection × col × row is
  14 × 80 × 9 × 38 ≈ 383k cells; payments are multisets over 22 goods with
  measured branching median 18, p99 1,114, max ~1,675
  ([03](03-move-enumeration.md)). A flat head needs hundreds of thousands of
  mostly-dead outputs plus a legality mask computed by enumerating anyway.
  Infeasible and game-specific.
- **Token-factorized policy / token-level tree**: principled, but a payment
  *level* is a single fat token (`'ShShWo'` is one completion string), partial
  commands aren't states the reducer can apply, and tree depth ×3–5 means
  *more* oracle calls per simulation, not fewer.
- **Move-scoring**: median branching is 18 and curation caps candidates at
  ~24–128 (`DEFAULTS.curation` in `agent/src/mcts/search.ts`); scoring each
  candidate with a small net conditioned on the state embedding handles
  variable action sets natively, keeps priors and visit targets on the same
  list, and is trivially game-agnostic.

## Design

`agent/src/game/oelAction.ts`. Layout (91 floats, `moveFeatureLen = 91`):

| Block | Offset | Size | Encoding |
| --- | --- | --- | --- |
| Command | 0 | 14 | one-hot in `featureSpec.vocab.commands` order (append-only stable) |
| Erection id | 14 | 1 | categorical 0–80 (0 = none), the *same* ids as the grid's erection channel (`erectionId` in `encode.ts`), capacity 256 |
| Placement col | 15 | 9 | one-hot at index `col + 2` (command cols are raw grid cols minus 2 — see `landscape.ts` `[col + 2]`) |
| Placement row | 24 | 38 | one-hot at index `row + gridAnchor` (18); also holds `BUY_PLOT`/`BUY_DISTRICT`'s `y` param |
| Buy side | 62 | 4 | one-hot over `MOUNTAIN`/`COAST`/`PLAINS`/`HILLS` (`GameCommandBuyPlotParams`/`…BuyDistrictParams`) |
| Resource counts | 66 | 22 | every remaining param through `parseResourceParam`, **summed** into per-good counts in `featureSpec.vocab.resources` order — this is what makes 1,600+ payment variants learnable |
| Scalars | 88 | 3 | `numParams`, `usesJoker` (any `Jo` token — see below), `totalGoods` |

Coordinate anchoring, corrected: command coordinates are already **logical**
— the engine adds the offset when indexing
(`player.landscape[row + player.landscapeOffset][col + 2]` in
`game/src/board/landscape.ts`) and subtracts it when emitting
(`forestLocations`). The state encoder places logical row `r` at output row
`r + ANCHOR` (`t.landscape[outputRow + t.landscapeOffset - ANCHOR]` in
`encode.ts`). So `encodeMove` uses the constants `gridAnchor = 18` and
`col + 2` and never reads `landscapeOffset`; policy rows align with
state-grid rows by construction. Out-of-range indices are clipped silently,
same as the state writer's `hot()`.

Token classifier (moves are canonical per [10](10-move-canonicalization.md),
so coords are separate integer tokens):

1. token 0 → command one-hot;
2. `/^-?\d+$/` → first numeric is col, second is row — except for
   `BUY_PLOT`/`BUY_DISTRICT`, whose single numeric is a row (`y`);
3. `MOUNTAIN|COAST|PLAINS|HILLS` → side one-hot;
4. member of the `ErectionEnum` value set → erection id via the exported
   lookup from [07](07-engine-fast-paths.md);
5. anything else → resource param: `parseResourceParam`, add counts; if any
   2-char slice is `Jo`, set `usesJoker` (the `USE LR1 Jo` / `CUT_PEAT 0 0 Jo`
   / `FELL_TREES 2 0 Jo` forms — `parseResourceParam` drops `Jo`, so without
   this flag `USE LR1` and `USE LR1 Jo` would encode identically).

Unknown tokens (future expansions) fall into case 5 and at worst contribute
only to `numParams` — the encoder never throws.

`ActionSpec` (in `adapter.ts`):
`{ version: 1, moveFeatureLen: 91, categorical: [{ name: 'erection',
offset: 14, capacity: 256, vocab }], blocks: [{name, offset, len}…] }` —
emitted as JSON next to shards so the PyTorch model builds itself data-driven
([18](18-model.md)) and the trainer asserts version compatibility.

## Inputs

- Canonical moves ([10](10-move-canonicalization.md)); the mover's state
  (kept in the signature for adapter uniformity and asserts, though the OeL
  encoder needs no per-state data — see anchoring note above); helpers
  exported in [07](07-engine-fast-paths.md) (`parseResourceParam`,
  erection-id lookup).

## Outputs

- `encodeMove(state, perspective, move, out: Float32Array): void` wired into
  the OeL adapter; `actionSpec` constant; `spec.json` emit helper.

## How it runs / verification

- `pnpm --dir agent test` — property tests over fixture-game states:
  - every enumerated move encodes NaN-free and in-bounds;
  - joker discrimination: `['USE','LR1']` ≠ `['USE','LR1','Jo']`;
  - **collision soundness**: whenever two distinct canonical moves encode to
    the same vector, applying both to the state yields deep-equal states
    (the pilgrimage-site case below), on a large fixture sample;
  - coordinate anchoring: for a known `BUILD G07 c r`, the row one-hot index
    equals the state-grid output row of that tile.

## Design notes & tradeoffs

- **Move-scoring vs flat vs token-factorized** — see the numbers above; the
  clincher is that the flat head's mask and the token tree's oracle calls
  both require the same enumeration move-scoring already does, so the
  alternatives pay move-scoring's cost *plus* their own.
- **One-hot coords vs two scalars**: one-hots cost 45 extra floats
  (~180 B f32; ≤128 candidates ⇒ ~23 KB per decision — trivial), let the
  first dense layer learn location-specific weights aligned with the state
  grid, and are exactly zero for coordinate-less moves (`COMMIT`,
  `WITH_PRIOR`) instead of a fake `(0, 0)`. Scalars force the net to learn
  coordinate arithmetic through ReLUs and conflate "no coordinate" with
  "row 0". Chosen: one-hot.
- **Shared erection embedding vs a separate table**: emitting the same
  0–80 id space as the grid channel lets the model use one `nn.Embedding`
  for both, so "the move builds G07" and "the board contains G07" meet in
  the same learned space — free transfer, fewer parameters. Cost: the
  embedding dim is coupled between state and action towers. The `spec.json`
  categorical block carries `name`/`capacity`/`vocab`, so splitting into a
  separate table later is a model-side change only. Chosen: share.
- **Resource counts lose payment order — does order matter?** Two levels:
  - *Within one param string*: no. Every consumer parses via
    `parseResourceParam`, which sums into a `Cost` bag — `'ShWo'` and
    `'WoSh'` are the same move to the reducer (and `combinations()` already
    emits one ordering).
  - *Across params*: only two buildings take two resource params
    (`grep params\[1\]`-equivalent audit): `houseOfTheBrotherhood.ts`
    (param1 = coins in, param2 = point-goods out — **disjoint good sets**,
    so the summed bag is unambiguous) and `pilgrimageSite.ts` (param1/param2
    each upgrade one relic; `Bo Ce` and `Ce Bo` both net −Book +Ornament —
    order-swapped variants are state-equivalent).
  So summing collapses only moves whose applied states are deep-equal. The
  one genuine information loss was the joker token, fixed by the
  `usesJoker` scalar. Residual effect of benign collisions: equivalent
  candidates get equal priors and split visits between them — which is the
  *correct* target, and [10](10-move-canonicalization.md) already merges
  literal duplicates before they reach the encoder.
