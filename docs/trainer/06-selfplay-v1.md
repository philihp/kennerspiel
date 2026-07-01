# 06 — Self-play generator v1

| | |
| --- | --- |
| Status | ✅ done (`agent/src/selfplay.ts`, `agent/src/cli/selfplay.ts`) |
| Package | `agent/` |
| Depends on | [04](04-baselines-arena.md), [05](05-uct-search.md) |

## Goal

Generate labeled games by having UCT play every seat, recording per-decision
search statistics (future policy targets) and the final outcome (value
target), in a compact replayable format.

## Design

- One MCTS search per decision; record `{ perspective, visits, chosen }` plus
  enough to reconstruct the state.
- **Store commands, not tensors**: a game is a command list (a few KB);
  dense tensors are regenerated later by replay+encode ([16](16-shard-exporter.md)).
- Output is JSONL, one game per line, appended so runs are resumable.

## Known limitations (fixed by [14](14-selfplay-v2.md))

- Each decision stores a copy of the full command prefix → O(steps²) file
  size; v2 replaces this with a `step` index into the game's command list.
- `visits` covers only *expanded* edges; unexpanded curated candidates are
  silently absent, which breaks policy-target support. v2 records the full
  candidate list, zeros included.
- No temperature schedule or root exploration noise.

## Inputs

- Game config (players/length/country), base seed, `MctsOptions` (`sims`…).

## Outputs

- JSONL lines: `{ commands, decisions: [{ perspective, commands, visits,
  chosen }], outcome, finished, steps }` appended to
  `selfplay-data/games-{length}-sims{N}.jsonl`.

## How it runs / verification

```sh
pnpm --dir agent selfplay 10 short 64   # 10 games, short config, 64 sims
```

- `pnpm --dir agent test` — decisions replay to legal states; outcome matches
  a fresh replay of `commands`.
