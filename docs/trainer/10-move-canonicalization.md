# 10 — Move canonicalization & dedupe

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [03](03-move-enumeration.md), [07](07-engine-fast-paths.md) |
| Milestone | M2 |

## Goal

Guarantee that one *distinct* move has exactly one representation, so policy
mass is never split across duplicates and JSONL candidates are stable keys.

## Why it's needed

`erectableLocations` (`game/src/board/landscape.ts`) emits joined
`"col row"` coordinate tokens, and the column completion path can re-offer the
row afterwards — so enumeration can produce e.g. `['BUILD','G07','3 2']` and
`['BUILD','G07','3 2','2']` (or `['BUILD','G07','3','2']`) which the reducer
parses identically. Left alone, these appear as separate candidates: the
policy target and the PUCT priors would each get a fraction of the true mass.

## Design

- `canonicalize(move: Move): Move` in `agent/src/game/oelMoves.ts`:
  split params on whitespace, re-tokenize coordinates as separate
  `col`,`row` integer strings, drop redundant trailing duplicates, keep
  resource-param strings verbatim (their internal order is already normalized
  by `combinations()` in the engine).
- `moveKey(move) = canonical tokens joined with a space` — the dedupe and
  serialization key used by the adapter, JSONL v2, and the exporter.
- `legalMoves()` (adapter, 09) canonicalizes then dedupes by `moveKey`.

## Inputs

- Raw enumerated moves from `enumerateMoves` / completion walks.

## Outputs

- `canonicalize`, `moveKey`; adapter `legalMoves` returns canonical, deduped
  moves only.

## How it runs / verification

- `pnpm --dir agent test` — property tests over states replayed from fixture
  games:
  - applying a raw move and its canonical form yields deep-equal states;
  - dedupe never merges two moves whose applied states differ;
  - explicit cases for joined `"col row"` tokens and redundant row re-offers.
