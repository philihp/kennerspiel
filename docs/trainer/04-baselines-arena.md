# 04 — Baseline policies & arena

| | |
| --- | --- |
| Status | ✅ done (`agent/src/policy.ts`, `agent/src/policies/`, `agent/src/arena.ts`, `agent/src/cli/arena.ts`) |
| Package | `agent/` |
| Depends on | [02](02-engine-adapter.md), [03](03-move-enumeration.md) |

## Goal

Fixed-strength reference opponents and a reproducible head-to-head harness,
so every later improvement (UCT, PUCT, each net generation) is measured, not
assumed. The same `runMatch` result object later drives gating
([22](22-arena-gating.md)).

## Design

### Policy interface (`agent/src/policy.ts`)

```ts
export type Policy = {
  name: string
  pick: (state: GameState, rng: Rng) => Move | undefined
}
```

`pick` returns `undefined` only when there is no legal move (stuck/terminal).
Policies are stateless closures; all randomness flows through the passed
`Rng`.

### Baselines (`agent/src/policies/`)

- `randomPolicy()` — one `sampleMove` per decision; no enumeration, so it is
  cheap enough to also serve as the rollout distribution's sanity mirror.
- `greedyPolicy(opts = { maxPerLevel: 12, maxMoves: 64 })` — 1-ply lookahead:
  enumerate (curated), `apply` each candidate, score the child with
  `scores(next)[me].total` where `me = playerToMove(state)` at the decision
  point, and play a uniformly random choice among the argmax set. Failed
  applies score `-Infinity`. Weak but non-trivial: it grabs immediate points
  before COMMITting and reliably beats random.

### Arena (`agent/src/arena.ts`)

```ts
export type GameConfig = { players; country; length; colors }
export const CONFIG_2P_LONG / CONFIG_2P_SHORT   // 2p france, colors R/G
opening(cfg, seed): Move[]     // [['CONFIG',…], ['START', seed, …colors]]

playGame(policies: Policy[], cfg, seed, rng, maxSteps = 8000): GameResult
runMatch(a: Policy, b: Policy, opts: MatchOptions): MatchResult
```

- **`playGame`** replays the seeded opening, then loops: seat =
  `playerToMove(state)`, policy = `policies[seat % policies.length]`, apply
  its pick. It stops at terminal, when a policy returns `undefined`, when an
  `apply` fails (defensive — a policy returned an illegal move), or at
  `maxSteps`. Result: `{ totals, outcome, steps, finished, commands }` — the
  full command list makes any game replayable/debuggable. Both seats draw
  from the *same* `rng` stream, so a game is a pure function of
  `(policies, cfg, seed, rng seed)`.
- **`runMatch`** plays `opts.games` games (default cfg `CONFIG_2P_LONG`,
  default `baseSeed = 1`). Game `g` uses board seed `baseSeed + g` and policy
  rng `pcg32(seed * 7919 + 1)`; odd games swap which policy takes seat 0
  so first-mover/turn-order advantage cancels over an even count. Winners are
  decided by comparing `outcome` components (rank-based, from
  [02](02-engine-adapter.md)) — equal outcomes count as a draw. Result:
  `{ a, b, games, aWins, bWins, draws, aWinRate, eloDiff, avgSteps,
  finishedRate }`, where `aWinRate = (aWins + 0.5·draws)/games` and
  `eloDiff = −400·log10(1/p − 1)` rounded, clamped to ±800 at p ∈ {0, 1}.

### CLI (`agent/src/cli/arena.ts`)

`pnpm --dir agent arena [games] [short|long] [specA] [specB]` — defaults
`10 short mcts:64 random`; any third arg other than `long` means short.
Specs: `random` | `greedy` | `mcts[:sims]` (default 64); unknown specs throw.
Prints one summary: per-policy wins and draws, A's win-rate and Elo estimate,
average steps/game, finished-rate, wall-clock seconds. Extended with `nn:`
specs by [22](22-arena-gating.md).

### Edge cases

Handled: unfinished games (maxSteps cutoff still scores via mid-game
`outcome`; `finishedRate` reports how often that happened), stuck policies,
illegal picks, odd game counts (one extra game as A-first — a slight residual
seat imbalance), 0%/100% win rates (Elo clamp). Not handled: >2 policies per
match (`playGame` seats N policies, but `runMatch`/CLI are head-to-head
2-player only), confidence intervals on the win rate.

## Design notes & tradeoffs

- **Greedy as a 1-ply lookahead vs a hand-written heuristic.** Chosen:
  enumerate-apply-score. Zero game knowledge to maintain and it strengthens
  automatically if scoring improves. Cost: ~`maxMoves` reducer applies *plus*
  one `control()`-based `scores()` per candidate per decision — by far the
  most expensive baseline; the tight default caps (12/64) exist to keep it
  usable, at the price of inheriting enumeration's prefix-order bias
  ([03](03-move-enumeration.md)).
- **Seat alternation in `runMatch` vs random seating.** Chosen: strict
  alternation with the board seed fixed per game index. Cancels first-mover
  advantage exactly over even N (random seating only in expectation), and
  paired seeds mean A and B face comparable board streams. Cost: not a full
  paired design — the two policies see the *same* rng stream interleaved, so
  a game is not "the same game with seats swapped"; true seed-paired swaps
  are a possible upgrade for gating (22).
- **Elo estimate at small N.** `eloFromWinRate` is a point estimate of the
  logistic inverse with no error bars: at 20 games, ±1 game swings ~±35 Elo
  around parity, and 0/20 collapses to the arbitrary −800 clamp. It is
  reported as a readability aid, not a decision statistic; gating (22) must
  use game counts large enough (or a significance test) that the point
  estimate is meaningful.
- **Winner from `outcome` vs raw totals.** Comparing rank-based outcome
  components is identical to comparing totals in 2p, but keeps `runMatch`
  correct if a >2p mode is ever tallied, and reuses the one blessed
  score-comparison path.
- **`maxSteps = 8000` safety valve.** Long games run several hundred
  commands; 8000 is an order of magnitude above that, so hitting it signals a
  livelock (e.g. a policy that never COMMITs) rather than a long game. Scoring
  cutoff games by current rank instead of discarding them keeps weak policies
  from hiding behind timeouts, at the cost of slightly noisy labels —
  `finishedRate` makes this visible.
- **Shared `Rng` per game vs per-policy streams.** One stream is simpler and
  fully reproducible; the cost is that changing one policy's consumption
  pattern perturbs the other's draws, so cross-version comparisons rely on
  seeds, not identical opponents' randomness. Accepted: matches are compared
  statistically, never game-by-game.

## Inputs

- Two policy specs, a game config (players/length/country), a base seed.

## Outputs

- Per-match summary to stdout: per-policy wins, draws, win-rate, Elo
  estimate, avg steps, finished-rate, elapsed time.
- `runMatch` result object (consumed programmatically by gating, 22).

## How it runs / verification

```sh
pnpm --dir agent arena 20 long greedy random   # greedy should dominate
```

- `pnpm --dir agent test` — `__tests__/arena.test.ts`: a full
  random-vs-random short game returns 2-entry totals/outcome and real
  progress (steps > 10); greedy achieves ≥ 0.5 win-rate over 4 deterministic
  seeded short games vs random (non-flaky by fixed seeds); wins + draws +
  losses account for every game across alternated seats.
