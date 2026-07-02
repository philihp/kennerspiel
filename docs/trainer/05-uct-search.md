# 05 — Pure UCT search

| | |
| --- | --- |
| Status | ✅ done (`agent/src/mcts/search.ts`, `agent/src/policies/mcts.ts`) |
| Package | `agent/` |
| Depends on | [02](02-engine-adapter.md), [03](03-move-enumeration.md) |

## Goal

A working net-free MCTS: strong enough to generate meaningful gen-0 training
data ([06](06-selfplay-v1.md)) and to serve forever as the fixed-strength
arena yardstick (`mcts:400` in the master plan). PUCT with learned priors
replaces the selection/rollout internals later ([13](13-puct-search.md));
the result shape is designed to survive that swap.

## Design

### Exported surface

```ts
export type MctsOptions = {
  sims: number             // simulations per move
  c?: number               // UCT exploration constant (default 1.4)
  rolloutDepth?: number    // max rollout commands (default 30)
  curation?: EnumerateOpts // per-node enumeration caps (default {24, 128})
}
export type SearchResult = {
  root: Node
  best: Move | undefined
  visits: { move: Move; n: number; q: number }[]  // sorted by n desc
}
search(state, rng, options): SearchResult

// policies/mcts.ts
mctsPolicy(options: MctsOptions): Policy   // name `mcts(${sims})`, pick → best
```

### Data structures

- `Node { state, mover, terminal, untried: Move[], edges: Edge[], n }` —
  `mover = playerToMove(state)` (−1 at terminal); `untried` is the curated
  `enumerateMoves` list, consumed from the back by `pop()`.
- `Edge { move, child, n, w: number[] }` — `w` is a **per-player value-sum
  vector** of length `numPlayers`; `q` for a player is `w[p]/n`.

### The four phases, per simulation

1. **SELECT** — while the node is non-terminal, fully expanded
   (`untried.length === 0`), and has edges: pick
   `argmax_edges( w[node.mover]/n + c·√(ln N / n) )` where `N = node.n`.
   The value term is the *mover at that node's* component, which is what
   makes multi-command turns and interrupts correct (see notes).
2. **EXPAND** — pop one untried move, `apply` it, wrap the child in a new
   `Node` (one `enumerateMoves` call), attach a fresh edge with `w = zeros`.
   If `apply` unexpectedly fails (enumerated moves should be legal), the
   child defensively reuses the parent's state rather than crashing.
3. **SIMULATE** — terminal leaf: `outcome(state)` directly. Otherwise a
   rollout: up to `rolloutDepth` (30) commands of `sampleMove` + `apply`
   (breaking early on terminal, no-move, or failed apply), then `outcome()`
   on the reached state. On a non-terminal state `outcome()` ranks *current*
   score totals — a built-in score-margin cutoff that lets rollouts stay
   shallow instead of playing out a 300-command game.
4. **BACKUP** — increment `n` on every node on the path (root included) and,
   on every edge, `n` plus the whole per-player value vector into `w`. No
   negamax sign-flip: each selection reads its own mover's component.

After `sims` iterations, `visits` reports every *expanded* root edge as
`{ move, n, q }` with `q = w[root.mover]/n`, sorted by visit count;
`best` is the most-visited move (standard robust-child rule).

### Complexity / perf

Per simulation: one `enumerateMoves` on the newly expanded node (the
dominant cost — a capped DFS of `control()` calls,
[03](03-move-enumeration.md)) plus ≤ `rolloutDepth` sampleMove/apply pairs
and an O(depth · players) backup. The select/rollout/backup loops are
deliberately imperative — they run sims × depth times per decision, where a
functional style's per-call allocations would dominate; cold paths elsewhere
keep the ramda style. At `sims=64` on the opening, a decision is on the
order of a second; the `completions()` fast path
([07](07-engine-fast-paths.md)) and benchmarks ([08](08-benchmarks.md))
target exactly this.

### Edge cases

Handled: terminal root (no untried, no edges ⇒ `best === undefined`),
mid-rollout dead ends, failed applies, interrupt turns (per-node `mover`),
2–4 players (vector values throughout). Not handled: transpositions (the
tree is a tree — identical states reached by different orders are searched
separately), progressive widening past the curation caps (moves the caps
drop are invisible to search), and no virtual loss (single-threaded only).

## Design notes & tradeoffs

- **Per-player value vectors vs negamax scalars.** Chosen: back up a
  `number[]` and select on the node-mover's component. Negamax assumes
  strictly-alternating zero-sum play; here a turn is a *run* of same-player
  nodes ending in `COMMIT`, `WORK_CONTRACT` interrupts splice the opponent
  mid-turn, and 3–4-player configs aren't two-sided at all. Keying off each
  node's own `activePlayerIndex` handles all of these with one rule. Cost:
  `players ×` memory/adds per edge — trivial — and "max my component" is
  maxⁿ (paranoid opponents are not modeled), the standard multiplayer-MCTS
  compromise.
- **UCB1 with `c = 1.4`.** `√2 ≈ 1.414` is the textbook constant for rewards
  in `[0,1]`, which the rank-based `outcome()` guarantees by construction for
  2–4 players (solo's raw-score `outcome()` violates that scale and is
  remapped to `σ((score − 500)/100)` by the adapter —
  [09](09-game-adapter.md)) —
  the constant and the value scale were chosen together. Not tuned further:
  this searcher's job is to be a *stable* yardstick; PUCT (13) is where
  exploration tuning effort goes.
- **Rollout depth 30 + score-margin cutoff.** Chosen: truncate and rank
  current totals rather than play to terminal (hundreds of commands) or
  bolt on a value heuristic. This is the single biggest speed lever in v1 and
  what makes `sims=64` playable. Cost: a real evaluation *bias* — current
  score ignores position (resources, engine-building) and early game rollouts
  barely differentiate; and rank (not margin) discards how far ahead a line
  is. Accepted deliberately: the whole point of the trainer is that a learned
  value head (12/13) replaces rollouts entirely.
- **Expansion order = `untried.pop()`.** Untried moves come off the *end* of
  the enumeration list — cheap O(1), deterministic, but it means expansion
  order inherits (reversed) engine completion order rather than being
  randomized. With enough sims UCB1 washes this out; at very low sims the
  first-expanded moves get a head start. Same determinism-over-debiasing call
  as the curation caps in [03](03-move-enumeration.md).
- **Curation caps `{maxPerLevel: 24, maxMoves: 128}` as search defaults.**
  Bounds per-node expansion cost and tree width on the fat-tail SETTLE/USE
  states. Cost: capped-away moves are *unsearchable*, and the visit
  distribution silently lacks them — tolerable for playing strength, but a
  data-quality problem for policy targets that [14](14-selfplay-v2.md) must
  record explicitly.
- **Robust child (max visits) vs max Q.** Visits are the standard, lower-
  variance action pick and double as the future policy target; Q of a
  1-visit edge is noise. `q` is still reported per edge for diagnostics and
  for the future targets.
- **No transposition table.** Ora et Labora states are large and hashing
  them per node would cost more than the (rare, order-dependent) transposition
  hits are worth at these sim counts; revisit only if profiling (08) says
  otherwise.
- **Fresh tree per decision (no reuse between moves).** Simpler lifetime
  semantics and correct under opponent moves outside the tree; costs
  re-expanding the root each turn. Tree reuse is an optimization PUCT-era
  work can pick up if throughput demands it.

## Inputs

- Root `GameState`, seeded `Rng`, `MctsOptions` (`sims`, `c=1.4`,
  `rolloutDepth=30`, curation caps `{24, 128}`).

## Outputs

- `search(state, rng, opts) → { root, best, visits: [{move, n, q}] }` — the
  visit distribution is the future policy target (made complete in
  [13](13-puct-search.md)/[14](14-selfplay-v2.md)).
- `mctsPolicy(opts)` — the search wrapped as an arena `Policy`.

## How it runs / verification

```sh
pnpm --dir agent arena 10 short mcts:64 random   # mcts should win convincingly
```

- `pnpm --dir agent test` — `__tests__/mcts.test.ts`: `best` is a legal move;
  root visits sum to > 0 and ≤ `sims`; every reported `q` lies in `[0,1]`;
  the search is deterministic under a fixed seed (same seed ⇒ same best
  move); `mctsPolicy` returns a legal move. "More sims ⇒ stronger" is *not*
  a unit test — it is observed via arena runs (`mcts:64` vs `random`, and
  later `mcts:N` ladders in [08](08-benchmarks.md)).
