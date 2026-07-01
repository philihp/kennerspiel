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

## Why it's needed (the exact mechanism)

`erectableLocations` (`game/src/board/landscape.ts`) emits **joined
`"col row"` tokens** (`` `${colIndex - 2} ${rowIndex - landscapeOffset}` ``),
and the next completion level re-offers **every** row in that column:
`completeBuild` (`game/src/commands/build.ts`) passes the whole joined token
as `rawCol` into `erectableLocationsCol`, whose
`Number.parseInt(rawCol, 10)` reads only the leading integer — the row baked
into the token is ignored. The reducer (`game/src/reducer.ts`) then parses
`BUILD [building, col, row]` positionally with `Number.parseInt` per token,
so the row also comes from the *fourth* token, never from the joined one.

Consequences, for a column with k erectable rows:

- enumeration emits k joined tokens × k row tokens = **k² complete commands
  that collapse to k distinct placements** — e.g. `['BUILD','G07','3 0','2']`
  and `['BUILD','G07','3 2','2']` both apply as col 3, row 2;
- none of them equals the human/web form `['BUILD','G07','3','2']`, which the
  reducer parses identically, so JSONL keys wouldn't even match replayed
  human games.

The same joined-token → per-column-rows → parseInt shape appears in:
`SETTLE` (`game/src/commands/settle.ts`, with a trailing resources param),
`FELL_TREES` / `CUT_PEAT` (`forestLocations` / `moorLocations`), and USE
params of forest-clearing buildings (`game/src/buildings/carpentry.ts`,
`forestHut.ts`, `printingOffice.ts` — e.g. `use.ts` calls
`carpentry(parseInt(params[0]), parseInt(params[1]))`). Left alone, these
duplicates split the policy target and PUCT priors ([13](13-puct-search.md)),
and waste curation budget: `maxPerLevel`/`maxMoves` caps in
`agent/src/moves.ts` count raw paths, so up to (k−1)/k of a column's budget
is spent re-discovering the same k placements.

## Design

`agent/src/game/oelMoves.ts`:

- **`canonicalize(move: Move): Move`** — token-count-preserving truncation:
  for each param token matching `/^-?\d+\s+-?\d+$/` (integer, whitespace,
  integer — coordinates can be negative after landscape expansion), replace
  it with `String(Number.parseInt(token, 10))`. All other tokens (command,
  building/settlement ids, resource strings like `'GnGnWo'`, `'Jo'`,
  `'MOUNTAIN'`) pass through verbatim.

  **Truncation, not splitting.** The reducer parses positionally: splitting
  `['SETTLE','SR1','3 2','2','ShSh']` into `[…,'3','2','2','ShSh']` would
  shift `resources` into the row slot and change the parse. Truncating the
  joined token to its leading integer (`'3 2'` → `'3'`) reproduces exactly
  what `Number.parseInt` already does, preserves every other token's
  position, and lands on the reducer-minimal form real players emit:
  `['SETTLE','SR1','3','2','ShSh']`.

- **`moveKey(move: Move): string`** = canonical tokens joined with a single
  space. Canonical tokens contain no whitespace, so the key is unambiguous
  and round-trips via `split(' ')`. This is the dedupe and serialization key
  for the adapter, JSONL v2 ([14](14-selfplay-v2.md)), and the exporter
  ([16](16-shard-exporter.md)).

- **Dedupe** — `legalMoves()` in the adapter ([09](09-game-adapter.md)) maps
  `canonicalize` over enumerated moves and keeps first occurrence per
  `moveKey` (a `Map<string, Move>` preserves insertion order). Additionally,
  fold a seen-`moveKey` set **into the DFS** in `enumerateMovesInfo`
  (`agent/src/moves.ts`) so `maxMoves` counts *distinct* moves and the
  curation budget stops paying the k² tax. `sampleMove` results are
  canonicalized too, so rollout-chosen moves share the same key space.

- **Resource params stay verbatim.** The engine generates each payment
  multiset once, in a deterministic stage order
  (`foodCostOptions`/`energyCostOptions` pipelines and `combinations()` in
  `game/src/board/resource.ts`; `rewardCostOptions` even sorts+uniqs), so
  re-normalizing them buys nothing. The legacy aliases `Po`/`Ho` that
  `parseResourceParam` accepts are never *emitted* by completions, so no
  alias collision arises from enumeration.

## Implementation plan

1. Add `canonicalize` + `moveKey` in `agent/src/game/oelMoves.ts` with the
   regex rule above (pure functions over `Move = string[]`).
2. Add the seen-set to `enumerateMovesInfo` (`agent/src/moves.ts`): push
   `canonicalize(partial)` and skip when `moveKey` was already seen;
   `truncated` semantics unchanged.
3. Wire `legalMoves` and `moveKey` into the OeL adapter
   ([09](09-game-adapter.md)); canonicalize `sampleMove` output there.
4. Re-run the [08](08-benchmarks.md) branching column and record raw vs
   deduped counts (expect the p99 tail to drop substantially on
   placement-heavy states).

## Edge cases

- **Canonicalize complete moves only, never partials.** Partial token lists
  feed back into `completions()` mid-walk, and some completion code inspects
  raw tokens structurally (e.g. `printingOffice.ts` rebuilds `"c r"` pair
  strings from prior params and matches with `startsWith`). Canonicalization
  is a boundary transform on finished commands.
- Multi-pair USE params (`printingOffice` takes up to four `[joined, row]`
  pairs, 8 params): per-token truncation is still correct because
  `printingOffice(...coords)` parseInts every param positionally.
- `FELL_TREES`/`CUT_PEAT` optional trailing `'Jo'` token: untouched by the
  regex; `['FELL_TREES','3 0','2','Jo']` → `['FELL_TREES','3','2','Jo']`.
- Idempotence: `canonicalize(canonicalize(m)) ≡ canonicalize(m)` (canonical
  tokens never match the regex again).
- `CONFIG`/`START` are only produced by `opening()`, never enumerated —
  excluded by construction, but the functions are total over any `Move`.

## Inputs

- Raw enumerated moves from `enumerateMoves` / completion walks /
  `sampleMove`.

## Outputs

- `canonicalize`, `moveKey` in `agent/src/game/oelMoves.ts`; dedupe inside
  `enumerateMovesInfo`; adapter `legalMoves` returns canonical, deduped moves
  only.

## How it runs / verification

- `pnpm --dir agent test` — new `agent/src/__tests__/canonical.test.ts`:
  - **Unit**: table tests for the regex rule (joined tokens, negatives,
    resource strings, `'Jo'`, idempotence, `moveKey` round-trip via
    `split(' ')`).
  - **Explicit duplicates**: from an early fixture state, assert raw
    enumeration contains `['BUILD',b,'3 0','1']`-style variants, that
    `canonicalize` maps them all to `['BUILD',b,'3','1']`, and that
    `legalMoves` returns each placement once.
  - **Property, over a state corpus** (states replayed from the
    [08](08-benchmarks.md) fixture command lists plus seeded random/greedy
    games): for every enumerated raw move `m`,
    `apply(state, m)` deep-equals `apply(state, canonicalize(m))` — the
    canonical form is behavior-preserving; and for every `moveKey` group, all
    members apply to deep-equal states — dedupe never merges two moves whose
    applied states differ.
- M2 exit criterion ("canonical dedupe proven") = these properties green over
  the corpus, plus the before/after branching numbers in
  [08](08-benchmarks.md).

## Design notes & tradeoffs

- **Canonicalizing in `agent/` vs fixing token emission in the engine.** The
  root cause is `erectableLocations`' joined tokens plus
  `erectableLocationsCol`'s re-offer — fixable in `game/`, which would also
  speed up enumeration (no k² walk at all). But the completion-token grammar
  is de-facto published API: the web UI's move picker and the MCP tools
  (`web/src/context/InstanceContext.ts`, `web/src/mcp/tools/*.ts`) drive the
  UX off these exact tokens, and the package is versioned for external
  consumers. Changing emission is a breaking `game/` change requiring UI
  redesign of the two-click location flow; canonicalizing at the agent
  boundary is additive and ships in M2. The engine-side fix stays on the
  table as a later coordinated change — this doc's rule keeps working either
  way (already-canonical tokens pass through).
- **Dedupe by `moveKey` vs by applied-state hash.** Hashing
  `apply(state, m)` per candidate would be maximally correct (merges *any*
  behavioral duplicates, e.g. two payment strings with identical effect) but
  costs a reducer call (~0.011 ms) per raw candidate — at a p99 of 1,000+
  raw moves that's ~10+ ms per node, dwarfing the enumeration it's cleaning
  up. It would also merge moves whose *commands* differ, making JSONL keys
  ambiguous on replay. `moveKey` dedupe is O(1) per move and merges exactly
  the parse-identical forms. State-hash comparison is used only in tests, as
  the ground truth the property suite checks `moveKey` against.
- **Risk of over-merging.** The truncation rule fires only on
  whitespace-joined integer pairs, which the engine emits solely as
  coordinate tokens; every other token class is untouched. The
  never-merge-distinct-states property over the corpus is the guard — if a
  future engine token legitimately contains `"int int"` with different
  semantics, that test fails before training data corrupts. The converse
  (under-merging: distinct keys, same applied state — e.g. equivalent
  payments) is deliberately tolerated: those are genuinely different
  commands, and merging them would need state hashing (above).
- **Seen-set inside the DFS vs dedupe-after.** Dedupe-after is simpler but
  leaves `maxMoves`/`maxPerLevel` counting duplicates, so curated candidate
  lists shrink by up to k× on placement-heavy states and `truncated`
  over-reports. The in-DFS set costs one `moveKey` per complete path and
  makes caps mean what [13](13-puct-search.md)/[14](14-selfplay-v2.md) assume
  they mean. Both layers ship (the adapter dedupes defensively regardless of
  which enumerator produced the moves).
