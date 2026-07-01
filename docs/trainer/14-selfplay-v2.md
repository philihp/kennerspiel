# 14 — Self-play v2 (JSONL v2)

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [10](10-move-canonicalization.md), [13](13-puct-search.md) |
| Milestone | M4 |

## Goal

Self-play games recorded in a format the training pipeline can actually
consume: complete policy-target support, O(steps) size, full provenance.

## What v1 gets wrong (measured in the code)

`agent/src/selfplay.ts` today stores, per decision, `commands: [...commands]`
— a copy of the *entire prefix* — so a 214-step game serializes
≈ 214²/2 ≈ 23k command copies (multi-MB lines, O(steps²)); and it records
`res.visits` from `search()`, which covers only *expanded* edges
(`root.edges` in `agent/src/mcts/search.ts`), silently dropping unexpanded
curated candidates and breaking policy-target support. There is also no
temperature or exploration noise: `chosen` is always the argmax.

## Design

`agent/src/selfplay.ts` rewritten around PUCT + evaluator (async now, since
`puct()` awaits the evaluator):

```ts
selfPlayGame(adapter, evaluator, cfg, seed, rng, opts): Promise<SelfPlayGameV2>
// opts: { sims, cPuct?, dirichlet?, tempMoves = 30, curation?, maxSteps = 8000 }
```

- **Loop**: from `opening(cfg, seed)` (the `CONFIG`/`START` pair,
  `agent/src/arena.ts`), while playing: `await puct(...)`; record a decision;
  sample the move (below); `apply`; push onto `commands`. Stops on terminal,
  `maxSteps`, or `best === undefined` (engine stall ⇒ `finished: false`).
  Per-game `rng` derivation stays a pure function of `seed` (v1 uses
  `mulberry32(seed * 7919 + 3)`), so a game is reproducible from its JSONL
  line alone, independent of worker assignment.
- **Temperature schedule**: for the first `tempMoves = 30` *decisions*,
  sample `π(a) ∝ visits(a)^(1/τ)` with τ = 1 (i.e. sample proportional to
  raw visits — one `rng()` draw against the cumulative sum); afterwards
  τ → 0 (argmax, first-index tie-break). If a general τ is ever configured,
  compute weights as `exp(ln n(a)/τ − max)` over `n(a) > 0` for numerical
  stability. Root Dirichlet noise is on throughout self-play
  ([13](13-puct-search.md)); both are off in arena play.
- **Forced decisions** (`forced: true` from PUCT, single candidate) are
  still recorded — visits `[sims]`, policy loss over a 1-way softmax is 0,
  but the state row still feeds the value head in
  [16](16-shard-exporter.md).
- **Evaluator failure**: the rejection propagates out of `selfPlayGame`; a
  game either produces one complete JSONL line or nothing (the worker CLI
  catches, logs, and moves on — [15](15-selfplay-workers.md)).

### JSONL v2 schema, one game per line

| Field | Type | Meaning |
| --- | --- | --- |
| `v` | `2` | schema version, first field, cheap to sniff |
| `gameId` | `string` | `"g" + seed` — stable, dedupe-able across resumes |
| `cfg` | `GameConfig` | `{ players, country, length, colors }` (`agent/src/arena.ts`) — per game, so one generation's files mix configs freely (the run config's weighted mix, [15](15-selfplay-workers.md)); solo games label `outcome` with the σ((score−500)/100) mapping from [09](09-game-adapter.md) |
| `seed` | `number` | opening + rng-derivation seed (see above) |
| `netId` | `string` | `evaluator.id` — `"rollout"` or e.g. `"gen-007"` |
| `search` | `object` | `{ sims, cPuct, dirichlet: {epsilon, alphaScale} \| null, tempMoves, curation: {maxPerLevel, maxMoves} }` |
| `commands` | `string[][]` | the whole game incl. opening — replayable |
| `decisions` | `Decision[]` | see below |
| `outcome` | `number[]` | per-player [0,1] from `outcome()`; mid-game score-rank if unfinished |
| `finished` | `boolean` | reached `GameStatusEnum.FINISHED` |
| `steps` | `number` | decisions taken |

`Decision`:

| Field | Type | Meaning |
| --- | --- | --- |
| `step` | `number` | index into `commands` of the chosen move — replay `commands[0..step)` to reconstruct the state; no prefix copies |
| `perspective` | `number` | `playerToMove` at the decision (encode slot 0) |
| `candidates` | `string[]` | FULL canonical list as `moveKey` strings ([10](10-move-canonicalization.md)), order = `adapter.legalMoves` |
| `visits` | `number[]` | aligned to `candidates`, zeros included, sums to `sims` |
| `q` | `number[]` | aligned per-candidate mover-Q from PUCT, rounded to 4 dp |
| `chosen` | `number` | index into `candidates` of the played move; `commands[step]` ≡ `candidates[chosen].split(' ')` |
| `forced` | `boolean?` | present-and-true only for single-candidate short-circuits |

Size check: a 214-decision long game at median 18 candidates × ~14 chars plus
two aligned number arrays is ~100–150 KB — linear in steps, versus multi-MB
quadratic v1 lines.

## Inputs

- Adapter, evaluator, run config (game cfg, sims, temperature, noise), seeds.

## Outputs

- `selfPlayGame(adapter, evaluator, cfg, seed, rng, opts): Promise<SelfPlayGameV2>`
- JSONL v2 lines (written by the worker CLI, [15](15-selfplay-workers.md)).

## How it runs / verification

- `pnpm --dir agent test` —
  - round-trip: replaying `commands` reproduces `outcome`; for sampled
    decisions, replaying `commands[0..step)` yields a state whose
    `legalMoves` (same caps + seed) equals `candidates`, and
    `candidates[chosen]` splits to `commands[step]`;
  - visits sum to sims at every decision;
  - temperature: with a fixed seed, sampled indices match the visit CDF; after
    `tempMoves`, chosen is always the argmax;
  - file size scales linearly with steps (regression guard vs v1).

## Design notes & tradeoffs

- **Full candidate list vs top-K truncation**: median cost is ~18 keys
  ≈ 250 B/decision and the curation cap bounds the worst case at
  128 × ~15 B ≈ 2 KB; a whole generation (≈2,000 games × ~100 KB) is
  ~200 MB — disk is the cheapest resource in this pipeline. Top-K would
  renormalize the visit mass over survivors, producing *biased* softmax
  targets whose support no longer matches what the net will see at play
  time, and it would break the `legalMoves ≡ candidates` replay invariant
  the tests (and the exporter) lean on. Truncation belongs, if ever, in the
  trainer's sampler — not in the durable archive.
- **`moveKey` strings vs token arrays**: one string per candidate halves
  the JSON overhead of an array of quoted tokens, is grep-able and directly
  usable as a dedupe/map key, and `split(' ')` recovers tokens losslessly
  because canonicalization ([10](10-move-canonicalization.md)) guarantees
  single-space-joined tokens with no embedded spaces. Token arrays would
  only re-encode the same information more verbosely.
- **Storing `q` or not**: `q` is the one field not recoverable by replay —
  it exists only inside the search that produced the game. It costs ~10% of
  line size and buys post-hoc diagnostics (search-vs-outcome calibration,
  blunder mining) and optional auxiliary value targets later. Since JSONL
  is the *durable* archive and shards are disposable
  ([16](16-shard-exporter.md)), we keep it: dropping an unused field later
  is free, regretting a missing one costs a regeneration run at ~1–3 s/move.
