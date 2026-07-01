# 06 — Self-play generator v1

| | |
| --- | --- |
| Status | ✅ done (`agent/src/selfplay.ts`, `agent/src/cli/selfplay.ts`) |
| Package | `agent/` |
| Depends on | [04](04-baselines-arena.md), [05](05-uct-search.md) |

## Goal

Generate labeled games by having UCT play every seat, recording per-decision
search statistics (future policy targets) and the final outcome (value
target), in a compact replayable format. v1 exists to prove the loop and to
surface the data-format problems early; [14](14-selfplay-v2.md) is the
training-grade rewrite.

## Design

### Exported surface (`agent/src/selfplay.ts`)

```ts
export type Decision = {
  perspective: number               // player to move (slot to encode from)
  commands: Move[]                  // full prefix so far → replay to rebuild the state
  visits: { move: Move; n: number }[]  // expanded root edges, by visit count
  chosen: Move
}
export type SelfPlayGame = {
  commands: Move[]                  // the whole game, replayable
  decisions: Decision[]
  outcome: number[]                 // per-player [0,1] value target
  finished: boolean
  steps: number
}
selfPlayGame(cfg: GameConfig, seed: number, rng: Rng,
             options: MctsOptions, maxSteps = 8000): SelfPlayGame
```

### Game loop

1. Start from `opening(cfg, seed)` (the arena's seeded
   `CONFIG`/`START` pair, [04](04-baselines-arena.md)) and `replay` it.
2. While `isPlaying` and under `maxSteps`: run one `search(state, rng,
   options)` ([05](05-uct-search.md)) for the current decision.
3. Record a `Decision`: `perspective = playerToMove(state)` (the
   `activePlayerIndex`, so interrupt decisions are labeled with the actual
   decider), a **copy of the full command prefix**, the search's visit list
   stripped to `{move, n}`, and `chosen = res.best`.
4. Play `chosen` (argmax visits — no temperature), append it to `commands`,
   continue. Break defensively if search returns no move or the apply fails.
5. Label the game: `outcome(state)` (rank-based per-player values — also
   valid at a `maxSteps` cutoff, where it ranks current totals), `finished =
   isTerminal(state)`, `steps`.

Every seat is played by the *same* searcher drawing from the *same* `rng`, so
a game is a pure function of `(cfg, seed, rng seed, options)`.

### CLI (`agent/src/cli/selfplay.ts`)

`pnpm --dir agent selfplay [games] [short|long] [sims]` — defaults
`1 short 64`. Game `g` uses board seed `1000 + g` and rng
`mulberry32(seed * 7919 + 3)` (a different stream than the arena's `+1`).
Each finished game is `JSON.stringify`-ed and **appended** as one line to
`selfplay-data/games-{length}-sims{N}.jsonl` (directory auto-created), with a
per-game progress line (steps, finished flag, outcome, seconds) on stdout.
Append-only output means interrupted runs lose at most the in-flight game and
re-runs accumulate into the same file — but re-running identical arguments
also *duplicates* seeds 1000..1000+g; distinct runs should vary `sims`/length
or the file. Single-process; the worker-pool CLI is
[15](15-selfplay-workers.md).

## Known limitations (fixed by [14](14-selfplay-v2.md))

- Each decision stores a copy of the full command prefix → O(steps²) file
  size (a ~250-step game stores ~31k command copies). v2 replaces this with a
  `step` index into the game's single command list.
- `visits` covers only *expanded* edges; unexpanded curated candidates — and
  everything the curation caps dropped before search even saw it — are
  silently absent, which breaks policy-target support. v2 records the full
  candidate list, zeros included, plus truncation provenance.
- No temperature schedule or root exploration noise: `chosen` is always the
  argmax, so games are deterministic given the seed and early-game diversity
  comes only from the board seed. v2 adds τ-sampling and Dirichlet noise
  (via [13](13-puct-search.md)).
- No format/config provenance on the line (`sims` lives only in the
  filename); v2's schema carries `v`, cfg, seed, netId, and search params.

## Design notes & tradeoffs

- **Store commands, not tensors.** Chosen: a game is its command list plus
  per-decision indices — a few KB — and dense tensors are regenerated later
  by replay + `encode` ([01](01-state-encoder.md),
  [16](16-shard-exporter.md)). Tensors at ~57 KB × ~250 decisions ≈ 14 MB/game
  would dwarf that, and — decisive — stored tensors freeze the encoder
  version, while stored commands let any future encoder/action-space change
  re-derive training data from the same games. Cost: export pays a full
  replay per game (cheap relative to search) and the engine must stay
  replay-compatible with old logs.
- **O(steps²) prefixes as a deliberate v1 shortcut.** Copying the prefix per
  decision made each `Decision` self-contained (any line fragment replays
  without context) and kept v1 to a page of code. The quadratic blow-up was
  understood upfront and is acceptable at v1 volumes (tens of games for
  pipeline bring-up); it is the first thing [14](14-selfplay-v2.md) deletes.
- **Recording only expanded edges.** v1 reuses `SearchResult.visits`
  verbatim rather than teaching the search to report its curated candidate
  list. Fine for *watching* the searcher; wrong for training, since a policy
  target needs the full support with explicit zeros. Kept anyway: defining
  the candidate-list format properly is entangled with canonical move keys
  ([10](10-move-canonicalization.md)), so v1 punts rather than inventing a
  throwaway string format.
- **Argmax play (no temperature).** Strongest play per game and zero extra
  machinery, at the cost of low state diversity across a run — mitigated
  slightly by per-game board seeds, properly fixed by v2's τ schedule.
  For gen-0 bootstrap data, quantity × seed variety was judged sufficient.
- **JSONL, one game per line, append-only.** Line-oriented output is
  crash-tolerant (a partial final line is detectably broken JSON),
  `grep`/`jq`-able, trivially mergeable across workers later, and needs no
  database. Cost: no dedup or run manifest — the run directory layout in the
  [README](README.md) plus v2 metadata take that over.
- **Reusing arena plumbing.** `opening`, `GameConfig`, and the engine seam
  are shared with [04](04-baselines-arena.md), so self-play games and arena
  games are byte-compatible command lists — one replay/debug path for both.

## Inputs

- Game config (players/length/country), base seed, `MctsOptions` (`sims`,
  and optionally `c`/`rolloutDepth`/curation — the CLI passes `{ sims }`
  only, taking the search defaults).

## Outputs

- JSONL lines `{ commands, decisions: [{ perspective, commands, visits,
  chosen }], outcome, finished, steps }` appended to
  `selfplay-data/games-{length}-sims{N}.jsonl`.
- `selfPlayGame(...)` for programmatic use.

## How it runs / verification

```sh
pnpm --dir agent selfplay 10 short 64   # 10 games, short config, 64 sims
```

- No dedicated unit-test file: v1's correctness rides on the tested layers it
  composes — search legality/determinism (`__tests__/mcts.test.ts`), game-loop
  mechanics (`__tests__/arena.test.ts`), and move legality
  (`__tests__/moves.test.ts`) — plus manual inspection of the JSONL (replay
  `commands`, confirm `outcome`/`finished`, spot-check that each decision's
  prefix replays to a state whose `activePlayerIndex` matches `perspective`).
  Round-trip and size regressions become real tests in
  [14](14-selfplay-v2.md).
