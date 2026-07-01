# 05 — Pure UCT search

| | |
| --- | --- |
| Status | ✅ done (`agent/src/mcts/search.ts`, `agent/src/policies/mcts.ts`) |
| Package | `agent/` |
| Depends on | [02](02-engine-adapter.md), [03](03-move-enumeration.md) |

## Goal

A working net-free MCTS: strong enough to generate meaningful gen-0 training
data and to serve forever as the fixed-strength arena yardstick.

## Design

- Classic UCT: SELECT (UCB1 over fully-expanded nodes) → EXPAND (pop one
  untried move) → SIMULATE (rollout) → BACKUP.
- **Per-player value vectors**: the game is multiplayer and not strictly
  zero-sum. Every edge backs up a `number[]` of per-player values; selection
  maximizes the component of the *mover at that node*. This is correct for
  runs of same-player nodes (a turn is several commands ending in `COMMIT`)
  and for `WORK_CONTRACT` interrupts.
- **Rollouts**: `sampleMove` (no enumeration), depth-capped (~30 commands),
  then `outcome()` on the reached state — which ranks by current score totals,
  acting as a score-margin cutoff so rollouts stay shallow.
- Hot loops are deliberately imperative (sims × depth iterations).
- `mctsPolicy({ sims, c?, rolloutDepth?, curation? })` wraps search as a
  `Policy` for the arena.

## Inputs

- Root `GameState`, seeded `Rng`, `MctsOptions` (`sims`, `c=1.4`,
  `rolloutDepth=30`, curation caps).

## Outputs

- `search(state, rng, opts) → { root, best, visits: [{move, n, q}] }` — the
  visit distribution is the future policy target (made complete in
  [13](13-puct-search.md)).

## How it runs / verification

```sh
pnpm --dir agent arena 10 short mcts:64 random   # mcts should win convincingly
```

- `pnpm --dir agent test` — `__tests__/mcts.test.ts`: best move is legal,
  search is deterministic under a fixed seed, more sims ⇒ ≥ strength.
