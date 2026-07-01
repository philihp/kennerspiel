# 04 — Baseline policies & arena

| | |
| --- | --- |
| Status | ✅ done (`agent/src/policies/`, `agent/src/arena.ts`, `agent/src/cli/arena.ts`) |
| Package | `agent/` |
| Depends on | [02](02-engine-adapter.md), [03](03-move-enumeration.md) |

## Goal

Fixed-strength reference opponents and a reproducible head-to-head harness,
so every later improvement (UCT, PUCT, each net generation) is measured, not
assumed.

## Design

- **Policies** (`Policy = { name, pick(state, rng): Move | undefined }`):
  - `randomPolicy()` — `sampleMove`, no enumeration.
  - `greedyPolicy()` — enumerate (capped), apply each, pick the move
    maximizing own `control().score.total`; ties broken randomly.
- **Arena**:
  - `playGame(policies[], cfg, seed, rng, maxSteps)` — seat each policy, play
    from a seeded opening (`['CONFIG',…], ['START', seed,…]`) to terminal.
  - `runMatch(A, B, { games, cfg, baseSeed })` — alternates seats each game
    (first-mover advantage cancels), tallies W/D/L, reports an Elo delta.
- **CLI**: `pnpm arena [games] [short|long] [specA] [specB]` with specs
  `random`, `greedy`, `mcts[:sims]` — later extended with `nn:` by
  [22](22-arena-gating.md).

## Inputs

- Two policy specs, a game config (players/length/country), a base seed.

## Outputs

- Per-match summary to stdout: wins/draws/losses per seat, Elo estimate.
- `runMatch` result object (consumed programmatically by gating, 22).

## How it runs / verification

```sh
pnpm --dir agent arena 20 long greedy random   # greedy should dominate
```

- `pnpm --dir agent test` — `__tests__/arena.test.ts`: seat alternation,
  determinism under fixed seeds, terminal accounting.
