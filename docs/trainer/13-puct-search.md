# 13 — PUCT search

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [09](09-game-adapter.md), [12](12-evaluator-interface.md) |
| Milestone | M4 |

## Goal

AlphaZero-style search: evaluator-driven leaf evaluation with policy priors
guiding selection, replacing (but preserving as an option, via
`RolloutEvaluator`) rollout evaluation.

## What is preserved from project 05, and what changes

`agent/src/mcts/puct.ts` is new; `agent/src/mcts/search.ts` stays untouched
as the sync UCT reference. Preserved semantics from `search.ts`:

- **Per-player value vectors**: edges accumulate `w: number[]` and selection
  maximizes the *mover-at-that-node* component (`edge.w[node.mover]`). This
  is what makes runs of same-player nodes (a turn is several commands ending
  in `COMMIT`) and `WORK_CONTRACT` interrupts correct — each node keys off
  its own `playerToMove` (`frame.activePlayerIndex`).
- Terminal leaves evaluated by `adapter.outcome()`; curation cap defaults
  (`{ maxPerLevel: 24, maxMoves: 128 }`); imperative hot loops.

What changes: expansion creates **all** edges at once with priors (needed to
align priors to candidates), selection uses PUCT instead of UCB1, the sim
loop is async around `evaluator.evaluate`, root noise and virtual loss are
added, and the result reports the **complete** candidate list.

## Design

Structures (generic over the adapter's `TState`/`TMove`):

```ts
type Edge<TMove> = { move: TMove; prior: number; child: Node | null;
                     n: number; w: number[]; vloss: number }
class Node { mover: number; terminal: boolean; n: number;
             value: number[]           // evaluator value at expansion
             edges: Edge<TMove>[] }    // one per candidate, aligned
```

- **Expansion**: `adapter.legalMoves(state, curation)` once, then one
  `evaluate([{ state, perspective: mover, candidates }])` call → store the
  per-player `value` vector on the node and one edge per candidate with its
  prior (defensively re-normalized; length-mismatch throws). Children stay
  `null` until first traversal (`apply` is deferred, so a node costs one
  enumeration + one evaluation, not `k` reducer calls).
- **Selection** at a node with total visits `N = node.n`:
  `score(a) = Q(a) + cPuct · P(a) · √max(N,1) / (1 + nEff(a))` where
  `nEff(a) = n(a) + vloss(a)`, `Q(a) = nEff > 0 ? w(a)[mover] / nEff
  : node.value[mover]` (first-play urgency = the node's own evaluated value
  for the mover; unvisited edges are neither free wins at Q=1 nor dead at
  Q=0). Argmax, first-index tie-break — deterministic.
- **Backup**: walk the stored path; for every node `n++`, for every edge
  `n++`, `w[p] += value[p]` for all `p`, and `vloss--` (see below). Values
  are always full per-player vectors in absolute seat order
  ([12](12-evaluator-interface.md)).
- **Root Dirichlet noise** (self-play only, off for arena):
  `P ← (1−ε)·P + ε·Dir(α)` with ε = 0.25 and **α scaled by branching**:
  `α = alphaScale / k`, `alphaScale = 10`, `k` = root candidate count
  (median 18 ⇒ α ≈ 0.55). Sampling: JS has no gamma sampler, so
  `agent/src/mcts/dirichlet.ts` implements per-candidate `Gamma(α, 1)`
  normalized to a simplex, with gamma via **Marsaglia–Tsang**: for α ≥ 1,
  `d = α − 1/3`, `c = 1/√(9d)`, repeat { `x ~ N(0,1)` (Box–Muller over two
  draws from the seeded `Rng`), `v = (1 + c·x)³`, accept when `v > 0` and
  `ln(u) < x²/2 + d − d·v + d·ln(v)` } → `d·v`; for α < 1 (the common case
  here), sample `Gamma(α+1)` and multiply by `u^(1/α)`. All randomness
  flows from the search `Rng` — seeded determinism holds noise included.
- **Virtual loss**: during descent each traversed edge gets `vloss++`
  (counted in `nEff` but adding nothing to `w`, i.e. an in-flight sim looks
  like a value-0 result to whichever mover inspects the edge — with
  per-player vectors this "loss for the local mover" falls out for free).
  Backup decrements it. With the default `concurrency = 1` this is
  add-then-remove within one simulation — bit-identical to no virtual loss
  — but `concurrency > 1` (Stage-2 batching) launches that many
  `runSimulation()` promises and the bookkeeping already keeps them off one
  path. Invariant: all `vloss === 0` after search (asserted in tests).
- **Complete visit output**: the result carries the full canonical candidate
  list with visit counts, zeros included — project 05 reports only expanded
  edges, which breaks policy-target support. Training needs the whole
  softmax support.

```ts
puct(adapter, state, rng, { sims, cPuct = 1.5, dirichlet?: { epsilon: 0.25,
     alphaScale: 10 }, curation?, concurrency = 1 }, evaluator)
  → Promise<{ best, candidates: TMove[], visits: number[], q: number[],
              value: number[], forced: boolean }>
```

Edge cases:

- **Terminal root** → `{ best: undefined, candidates: [], visits: [],
  forced: false }`; callers (self-play, arena) treat it as game over.
- **Single candidate** → short-circuit: no evaluator call, no simulations,
  return `visits = [sims]`, `forced = true`. Forced decisions are common
  (interrupt replies, lone `COMMIT`) and this saves entire searches.
- **No candidates while non-terminal** (enumeration hiccup) → `best:
  undefined`, mirroring `search.ts`'s `res.best === undefined` path.
- **Evaluator failure mid-search** → the rejection propagates out of
  `puct()`; no partial result is returned and no backup happens for the
  failed simulation (the game is abandoned by the caller,
  [15](15-selfplay-workers.md)).

## Inputs

- Root state, seeded `Rng`, options, an `Evaluator`
  (`RolloutEvaluator` ⇒ gen-0 behavior; `OnnxEvaluator` ⇒ NN generations).

## Outputs

- `puct()` search function + an async `puctPolicy` wrapper for the arena.

## How it runs / verification

- `pnpm --dir agent test` — seeded determinism (with and without Dirichlet);
  visits sum to sims; candidate list matches `adapter.legalMoves` exactly;
  virtual-loss invariant (`vloss === 0` everywhere post-search); forced
  short-circuit; Dirichlet sampler moments (mean ≈ 1/k, sums to 1) and
  α < 1 branch coverage.
- Strength sanity via arena: PUCT with `RolloutEvaluator` (uniform priors) ≈
  UCT at equal sims against `random`/`greedy` — the refactor must not lose
  strength before the net adds any.

## Design notes & tradeoffs

- **New `puct.ts` vs modifying `search.ts` in place**: `mcts:400` is the
  permanent arena yardstick (see [README](README.md)) and golden-seed tests
  pin `search.ts`'s exact `Rng` consumption; editing it in place would
  silently move the yardstick the new net is measured against. The cost is
  ~150 duplicated lines (node/backup skeleton); shared scraps (`zeros`,
  option types) can migrate to a common module without touching behavior.
- **Expand-all-candidates vs progressive widening**: priors are only
  meaningful over the full candidate list, and the evaluator scores all
  candidates in the one call expansion already makes — so widening would
  not save evaluations, only per-edge allocation on fat nodes. With median
  branching 18 and curation capping the p99 tail at 128
  ([03](03-move-enumeration.md)), that saving is marginal, while widening
  would break the "complete visit support" training target and complicate
  prior renormalization. Curation *is* our widening.
- **Virtual loss now vs when batching lands**: it is one integer per edge
  and ±1 in two loops now, versus reopening a validated backup path later
  and re-certifying every determinism test under concurrency. Since
  `concurrency = 1` makes it provably behavior-neutral, the risk of
  carrying it early is nil and Stage 2 becomes a config change.
- **Dirichlet α scaled by branching**: a fixed α (chess's 0.3) assumes a
  roughly constant action count; here the root varies from 1–2 (forced
  replies) to the 128 cap, so fixed α would over-flatten narrow roots and
  under-perturb wide ones. `α = 10/k` keeps the expected noise mass per
  candidate constant — the same reasoning behind AlphaZero's per-game α
  (0.3 / 0.15 / 0.03 for chess / shogi / Go tracks ~10/⟨branching⟩).
- **Rollout fallback inside PUCT vs behind the evaluator**: baking a
  rollout branch into `puct.ts` would mean two leaf-evaluation code paths
  to test and a gen-0/gen-N behavioral fork inside search. Keeping rollouts
  as `RolloutEvaluator` ([12](12-evaluator-interface.md)) means the only
  difference between generations is which evaluator is constructed. The one
  cost worth documenting: the rollout `Rng` is the evaluator's, separate
  from the search `Rng`, so seeds are reported as a pair in JSONL
  provenance.
