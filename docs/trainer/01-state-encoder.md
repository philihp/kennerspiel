# 01 — State encoder (egocentric tensor)

| | |
| --- | --- |
| Status | ✅ done (`game/src/encode.ts`) |
| Package | `game/` |
| Depends on | — |

## Goal

Encode a `GameState` as a fixed-length `Float32Array` suitable as neural-net
input, so any position can be turned into training/inference features without
bespoke feature engineering per consumer. The layout is published as data
(`featureSpec`) so the exporter ([16](16-shard-exporter.md)) and the PyTorch
model ([18](18-model.md)) never hard-code offsets.

## Design

### Exported surface

```ts
export const FEATURE_LEN: number   // 14,670 with the current vocab
export const encode: (state: GameState, perspective?: number) => Float32Array
export const featureSpec: FeatureSpec
```

`encode` allocates one zero-initialized `Float32Array(FEATURE_LEN)` and fills
it in a single left-to-right pass. `perspective` defaults to
`frame.currentPlayerIndex` — note this is **not** `activePlayerIndex`, so
callers encoding "the player to move" during a `WORK_CONTRACT` interrupt must
pass the perspective explicitly (see [02](02-engine-adapter.md)'s
`playerToMove`). A `SETUP`-status state returns the all-zero vector rather
than throwing.

### Layout

`FEATURE_LEN = MAX_PLAYERS(4) × PLAYER_BLOCK(3,455) + FRAME(549) + SHARED(301)
= 14,670` floats (~57 KB dense f32, ~29 KB f16). ([07](07-engine-fast-paths.md)
reserves `COUNTRY_CAPACITY = 8` for the country one-hot, growing SHARED to 307
and `FEATURE_LEN` to 14,676; pipeline docs downstream of 07 quote that number.)

| Block | Size | Contents |
| --- | --- | --- |
| Player scalars | 35 | 22 resource counts, wonders, 4 clergy buckets `[lb_unplaced, lb_placed, prior_unplaced, prior_placed]`, 8-bit in-hand settlement-type mask |
| Player grid | 38×9×10 = 3,420 | per tile: 6 land one-hots, 1 categorical erection-id channel, 3 clergy flags `[laybrother, prior, opponent-owned]` |
| Frame | 549 | round (raw), settlementRound one-hot (7), current/active player one-hots over *rotated slots* (4+4), 4 booleans, bonusActions command bitmask (14), nextUse one-hot (3), usable + unusable building masks (256+256) |
| Shared | 301 | rondel deltas (9) and yields (9), still-available buildings mask (256), plot + district prices (9+9, zero-padded), wonders remaining, config one-hots: players (4), length (2), country (2 today; reserved to 8 by [07](07-engine-fast-paths.md)) |

Empty player slots (games with <4 players) are zero blocks.

### Egocentric rotation

`rotateOrder(numPlayers, perspective)` maps output slot `s` to absolute seat
`(perspective + s) % numPlayers`, so slot 0 is always "me" and relative turn
order is preserved. The frame's `currentPlayerIndex`/`activePlayerIndex`
one-hots are emitted in rotated slot space, not absolute seats.

### Erection vocabulary (categorical, color-collapsed)

A tile's building/settlement is a single integer id in a **categorical
channel** (0 = empty, 1..80 today), not a one-hot; the model embeds it.
Colored variants collapse to one generic key — `L[RGBW][123]` →
`ClayMound`/`FarmYard`/`CloisterOffice`, `S[RGBW][1-8]` → `Settlement1..8` —
because a colored tile only ever sits on its owner's board and slot identity
already carries ownership. Country variants (e.g. `F03` GrainStorage vs `I03`
Granary) stay distinct: different buildings, not colors. The unified vocab is
72 generic buildings followed by 8 settlement types; settlement ids start at
`buildings.length + 1`. All vocab-shaped features (the three 256-wide masks)
reserve `VOCAB_CAPACITY = 256` slots so adding expansion buildings never
changes `FEATURE_LEN`. Enum orderings are **append-only** — trained weights
are keyed by slot/id position and silently misalign if anything is reordered.

### Grid anchoring

The landscape grows in both directions (`landscapeOffset` tracks rows bought
above row 0). Output row `r` reads logical row `r + landscapeOffset − ANCHOR`
with `ANCHOR = 18`, `H = 38`, `W = 9`, so a player's logical row 0 always
lands at the same output row regardless of purchases; two states differing
only in `landscapeOffset` bookkeeping encode identically (pinned by test).
Cells outside the window are clipped; `undefined` tiles write zeros.

### Normalization

Rondel features are normalized: delta = `((slot − pointingBefore) mod 13)/13`,
yield = `take(pointingBefore, slot, config)/10` (0 for tokens not yet on the
rondel). Everything else — resource counts, round, prices, wonders, clergy
buckets — is a raw count; the net owns scaling.

### Writer

An imperative preallocated `Writer` (`put`/`hot`/`bits`/`skip`) writes
straight into the output buffer; `hot` and `bits` silently drop out-of-range
indices (this is what makes the 256-wide masks forward-compatible). One pass,
O(FEATURE_LEN), no intermediate feature arrays; the only per-call allocations
are the output buffer and small per-tableau helpers. `erectionId` still does
an `indexOf` over the 80-entry vocab per occupied tile — a known micro-cost
that [07](07-engine-fast-paths.md) replaces with a precomputed `Map`, along
with an `encodeInto(state, perspective, out, offset)` variant so hot callers
reuse one scratch buffer.

### featureSpec

Machine-readable layout: `featureLen`, grid geometry (`height`, `width`,
`gridAnchor`), `tileChannels`, `vocabCapacity`, per-tile channel offsets, a
`categorical` list telling the model which channels to embed (currently just
`erection` with capacity 256 and its vocab), block offsets
(`players[4]`, `frame`, `shared`, and intra-player-block offsets), and every
vocab list (erections, buildings, settlements, lands, commands, resources,
rondel keys, settlement rounds, next-uses, lengths, countries).

### Edge cases

Handled: SETUP states (zero vector), <4 players (zero blocks), missing rondel
tokens, prices shorter than 9 slots, tiles/rows outside the 38×9 window,
unknown mask indices (dropped). Not handled: perspectives ≥ `players.length`
(caller contract), and no symmetry augmentation — the board has no useful
symmetries to exploit.

## Design notes & tradeoffs

- **Egocentric rotation vs absolute seats.** Chosen: rotate so perspective is
  slot 0. The net never spends capacity learning seat interchangeability, and
  each position yields N training samples (one per perspective). Alternative:
  absolute seats plus a "my seat" indicator — simpler, but forces the net to
  learn the same value function four times. Cost: consumers must be careful
  that player-index features (frame one-hots) are in rotated space.
- **Categorical erection id vs one-hot.** Chosen: one float channel holding an
  integer id, embedded by the model. One-hot at capacity 256 would cost
  38×9×256 ≈ 87k floats per player; categorical keeps the grid at 10 channels
  and makes new buildings a pure embedding-table growth. Cost: the model must
  special-case this channel (hence `featureSpec.categorical`), and the raw id
  is meaningless as a continuous float.
- **Fixed 256 vocab capacity.** Chosen: reserve 256 slots wherever the
  building vocabulary appears. Adding expansion buildings never changes
  `FEATURE_LEN`, so old shards and old checkpoints stay shape-compatible.
  Cost: ~3×176 permanently-zero floats today. Alternative — exact-size masks —
  saves ~0.5 KB but breaks every artifact on each vocab change.
- **Append-only enum ordering.** Trained weights are keyed by id; reordering
  is a silent corruption, not an error. The rule is enforced socially (header
  comment + tests pinning specific ids) rather than by a checksum; a vocab
  hash in shard metadata is a cheap later hardening ([16](16-shard-exporter.md)).
- **Color collapse.** Chosen: collapse colored duplicates, keep country
  variants. Shrinks the vocab (113 raw enum values → 80 ids) and removes a
  spurious feature dimension. Cost: relies on the invariant that colored tiles
  only appear on their owner's board — true in this game, an assumption to
  re-verify for future games.
- **Anchored grid vs offset-as-feature.** Chosen: shift rows so logical row 0
  is fixed at output row 18, making features translation-stable for a future
  conv/attention model. Alternative: raw rows + a `landscapeOffset` scalar —
  smaller (H could be ~15) but every purchase shifts all learned spatial
  features. Cost: 38 rows of mostly-zero padding.
- **Zero vector for SETUP instead of throwing.** Encoding is total over all
  game statuses, so pipelines never need status guards; the cost is that a
  zero vector is a valid-looking input that means "nothing", which consumers
  must not train on.
- **Fresh buffer per call.** Simple ownership semantics; ~57 KB per call is
  fine for training-data export but not for per-simulation use. Deliberately
  deferred to [07](07-engine-fast-paths.md) (`encodeInto`) rather than
  complicating the v1 API.

## Inputs

- A `GameState` (any status) and an optional perspective index (defaults to
  `frame.currentPlayerIndex`).

## Outputs

- `encode(state, perspective?) → Float32Array(FEATURE_LEN)`
- `featureSpec`, `FEATURE_LEN` exported from `hathora-et-labora-game`.

## How it runs / verification

- Library code — consumed by the exporter ([16](16-shard-exporter.md)) and
  evaluators ([12](12-evaluator-interface.md), [21](21-onnx-evaluator.md)).
- `pnpm --dir game test` — `game/src/__tests__/encode.test.ts` pins: zero
  vector for SETUP; output length = `FEATURE_LEN` (and < 20k, guarding against
  regressing to the old dense one-hot layout); `vocabCapacity` = 256 with
  headroom; resource offsets via `featureSpec`; perspective rotation (wood
  counts land in rotated slots); tile land/erection/clergy channels;
  color-collapse (`ClayMoundR` ≡ `ClayMoundG`) and country distinctness
  (F03 ≠ I03); opponent-clergy flag; settlement ids after buildings;
  anchor invariance under `landscapeOffset`; clergy buckets; bonusActions
  bitmask position; rondel yield/delta values incl. missing tokens; the
  available-buildings mask.
