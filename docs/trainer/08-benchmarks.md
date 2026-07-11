# 08 — Benchmark harness

| | |
| --- | --- |
| Status | ✅ done |
| Package | `agent/` |
| Depends on | [03](03-move-enumeration.md), [07](07-engine-fast-paths.md) |
| Milestone | M1 |

## Goal

A repeatable benchmark CLI so performance claims are measured, pinned in docs,
and re-checked after every engine or search change. Self-play throughput is
the binding constraint of the whole project (see the risk section in
[README](README.md)); this is the instrument. It is also where the
[07](07-engine-fast-paths.md) fast paths prove their worth, and where the
agent flips its own call sites onto them.

## Implementation plan

1. **CLI entry** — `agent/src/cli/bench.ts`, plus a script in
   `agent/package.json` alongside the existing `arena`/`selfplay` entries:
   `"bench": "node --import tsx/esm src/cli/bench.ts"`. Run as
   `pnpm --dir agent bench`.

2. **State corpus** — realistic replayed states, three sources, merged:
   - **Fixture replay**: the fixture games in `game/src/__tests__/` are the
     best real-game data we have, but they live *inside* test files —
     `game21872.test.ts` is ~392 inline `reducer(...)` calls (4p long), while
     `game4aedf9e5.test.ts` holds a plain `map(split(' '), [...])` command
     list (3p long) that lifts straight out. Extract one or two command lists
     into `agent/src/bench/fixtures/*.json` (array of space-joined command
     strings) rather than importing across packages from test files.
   - **Seeded generated games** (default, zero maintenance): play a handful of
     deterministic games at bench startup with the existing `greedyPolicy` and
     `randomPolicy` via `playGame` (`agent/src/arena.ts`) — legal, full-length
     trajectories in a few seconds.
   - **Self-play JSONL** (`--games <path>`) once [06](06-selfplay-v1.md)/
     [14](14-selfplay-v2.md) output exists — the most representative corpus,
     preferred when available.

   Replaying each command list through `apply()` (`agent/src/engine.ts`) and
   collecting **every intermediate state** yields hundreds of mid-game states
   per game; sample down to a fixed-size corpus (e.g. 500 states, seeded
   shuffle) so runtimes stay constant.

3. **Measured operations** (each timed per state):
   - `reducer` apply per command (timed during the replay itself)
   - `control(state, [])` vs `completions(state, [])` — the headline 07 win
   - `scores(state)` vs `control(state, []).score` — the rollout/`outcome()`
     path (see [07](07-engine-fast-paths.md))
   - `enumerateMoves` at the search curation caps
     (`{ maxPerLevel: 24, maxMoves: 128 }`, the `DEFAULTS` in
     `agent/src/mcts/search.ts`) and uncapped
   - `sampleMove` (the rollout inner loop, `agent/src/moves.ts`)
   - `encode` vs `encodeInto` into a reused scratch buffer
   - branching factor per state: uncapped `enumerateMoves().length`, plus —
     once [10](10-move-canonicalization.md) lands — the deduped count, so the
     duplicate inflation is visible as its own column
4. **Timing methodology** — small and honest, not a framework:
   - `process.hrtime.bigint()` around each op; one warmup pass over the whole
     corpus first (JIT/IC warmup), then N timed reps per state (N chosen per
     op so each sample ≥ ~1 µs of work; batch ultra-cheap ops).
   - Aggregate **across states** (not across reps of one state): report
     median / p90 / p99 / max and the corpus size.
   - Defeat dead-code elimination by accumulating a checksum from each result
     (e.g. sum of completion lengths, first float of the encode buffer) and
     printing it once.
   - `--json` flag for machine-readable output; default is a markdown table
     on stdout, pasted into this doc's baseline section when numbers move.

5. **Flip agent call sites onto the fast paths** (same PR or immediately
   after, so the bench measures what self-play will actually run):
   `agent/src/moves.ts` `control(state, partial).completion ?? []` →
   `completions(state, partial)`; `agent/src/engine.ts` `scores()` →
   the game package's `scores` export. Both are one-line diffs guarded by the
   07 parity suite.

## Inputs

- Fixture command lists (extracted to `agent/src/bench/fixtures/*.json`);
  seeded policy games; optionally a JSONL file of self-play games
  (`--games <path>`).

## Outputs

- Benchmark table on stdout; pinned numbers recorded in the baseline section
  below and referenced from [README](README.md) / PR descriptions.

## How it runs / verification

```sh
pnpm --dir agent bench
pnpm --dir agent bench --games runs/r1/gen-000/selfplay/worker-0.jsonl
pnpm --dir agent bench --json > bench.json
```

- Sanity: numbers are stable (< ~10% jitter on medians) across two
  consecutive runs on an idle machine; the printed checksum is identical
  across runs given the same corpus seed (proves determinism of the corpus
  and that ops weren't optimized away).
- The M1 exit criterion reads off this table: `completions()` ≫ `control()`
  on enumeration-heavy states, `encodeInto` ≤ 0.5 ms.

## Baseline

`pnpm --dir agent bench` (default corpus: 500 states sampled seed 12345 from
3,182 replayed states — the two fixtures plus three seeded policy games). Run
on a shared cloud runner, so treat absolute ms as machine-relative; the durable
claims are the **ratios** and the shape of the tail.

| Op | p50 | p90 | p99 | max | mean |
| --- | ---: | ---: | ---: | ---: | ---: |
| `reducer` apply (per command) | 0.038 | 0.098 | 0.280 | 2.99 | 0.057 |
| `control(state, [])` | 0.626 | 0.960 | 1.837 | 2.06 | 0.642 |
| **`completions(state, [])`** | **0.085** | **0.164** | **0.311** | 0.36 | **0.100** |
| `control(state, []).score` | 0.640 | 1.022 | 1.833 | 2.20 | 0.654 |
| **`scores(state)`** | **0.452** | **0.746** | **1.709** | 1.98 | **0.462** |
| `enumerateMoves` (capped 24/128) | 0.338 | 2.397 | 12.71 | 43.8 | 1.196 |
| `enumerateMoves` (uncapped) | 0.352 | 7.199 | 84.84 | 153.7 | 3.294 |
| `sampleMove` | 0.151 | 0.338 | 1.302 | 5.87 | 0.211 |
| `encode` | 0.029 | 0.050 | 0.165 | 1.21 | 0.036 |
| **`encodeInto`** (reused scratch) | **0.020** | **0.034** | **0.044** | 0.22 | **0.021** |
| branching (raw, pre-dedupe) *(count)* | 23 | 550 | 2,306 | 17,144 | 237 |

**M1 exit criterion met.** `completions()` is ≈**7×** `control()` at the median
(0.085 vs 0.626 ms) and ≈**6×** at p99 — enumeration no longer pays for `flow`
+ `score` on every DFS node. `scores()` shaves the flow/completion work off the
rollout/`outcome()` path (0.452 vs 0.640 ms). `encodeInto` is **≈0.02 ms**
(well under the 0.5 ms target) and ≈1.5× cheaper than `encode`'s per-call
allocation. The branching tail (p99 2,306, max 17,144 on random-policy SETTLE
states) is why enumeration is capped in search and why move canonicalization
([10](10-move-canonicalization.md)) is the next lever.

> **Engine note (out of scope for 08, worth fixing later).** `enumerateMoves`
> is deterministic for a *fixed* state within a fresh sequence (self-play and
> the mcts determinism tests rely on this and pass), but its result on a given
> state can shift depending on prior `reducer`/`apply` calls in the same
> process — the completion enumeration carries module-level mutable state. The
> bench's reproducibility `checksum` therefore covers only the pure read ops
> (`control`/`completions`/`scores`/`encode`/`encodeInto`); `enumerateMoves`
> and `sampleMove` are timed but excluded from it. This is orthogonal to
> project 07 — `completions` is byte-identical to `control().completion`.

## Design notes & tradeoffs

- **Realistic replayed corpus vs synthetic states.** Synthetic states (hand-
  built tableaus) are easy to generate in volume but miss exactly what makes
  the engine slow: late-game landscapes full of buildings, fat
  `usableBuildings` lists, and SETTLE/USE payment explosions. The branching
  tail (p99 > 1,000) only exists in real mid/late-game states. Replay is
  slightly more code (corpus extraction) but measures the distribution the
  search will actually see. Chosen: replayed states, with seeded generated
  games as the zero-maintenance default and self-play JSONL as the preferred
  source once it exists.
- **Median/p90/p99 vs mean.** Branching factor and therefore enumeration cost
  are heavy-tailed (median 18 vs max 1,675); a mean is dominated by a few
  SETTLE states and by GC pauses, and "improved the mean" can hide a
  regression on the p99 states that actually stall workers. Percentiles keep
  the tail visible. Means are still printed as a minor column since
  throughput math (games/day) is a mean-flavored quantity.
- **Pinning numbers in docs vs CI perf gates.** A CI gate on wall-clock
  numbers is flaky on shared runners (noisy neighbors, differing CPUs) and
  would either be so loose it never fires or so tight it cries wolf; this
  project has one developer machine and one GPU box. Chosen: pinned numbers
  in this doc, re-run manually per relevant PR, with the `--json` output
  checked into the PR description when a claim is made. Revisit only if a
  silent regression actually burns us. (Non-perf properties — the checksum,
  corpus determinism — *are* asserted and safe to run anywhere.)
- **Plain `hrtime` loop vs a benchmark library (tinybench, mitata).** A
  library buys statistical niceties but adds a dependency to a package that
  currently has exactly `ramda` + the game engine, and its auto-tuned
  iteration counts make cross-run comparisons noisier. The ops here are
  microseconds-to-milliseconds — a warmup pass plus fixed rep counts is
  sufficient and keeps the harness fully deterministic. Chosen: hand-rolled.
- **Where fixtures live.** Importing command lists from `game/src/__tests__/`
  would couple the agent to another package's test internals (and
  `game21872.test.ts` doesn't even hold a list — it's inline code). Copying
  one or two lists into `agent/src/bench/fixtures/` duplicates data that
  never changes (finished games are immutable) — acceptable, and it keeps
  `pnpm --dir agent bench` self-contained.
