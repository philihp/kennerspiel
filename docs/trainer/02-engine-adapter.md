# 02 — Engine adapter

| | |
| --- | --- |
| Status | ✅ done (`agent/src/engine.ts`, `agent/src/rng.ts`) |
| Package | `agent/` |
| Depends on | — |

## Goal

A thin, typed seam between the published game engine and everything the
trainer builds, so search/self-play code never touches raw engine calls and
error handling lives in one place.

## Design

- `Move = string[]` — one complete command, e.g. `['BUILD','G07','3','2']`.
- Wrap `reducer` so illegal/unparseable moves return `undefined` instead of
  throwing.
- `outcome(state)` maps final (or cutoff) scores to a per-player rank-based
  vector in `[0,1]`: `(beaten + 0.5·tied) / opponents`. This generalizes to
  3–4 players and doubles as the score-margin rollout cutoff value.
- `rng.ts`: mulberry32 — deterministic, seedable, cheap. Everything downstream
  takes an `Rng`, never `Math.random`.

## Inputs

- The `hathora-et-labora-game` package: `reducer`, `control`, `initialState`.

## Outputs

Exported functions:

```ts
apply(state, move): GameState | undefined
replay(commands): GameState | undefined
isPlaying(state): boolean
isTerminal(state): boolean
playerToMove(state): number        // frame.activePlayerIndex, handles interrupts
numPlayers(state): number
scores(state): Score[]
outcome(state): number[]           // per-player [0,1]
```

## How it runs / verification

- Library code — consumed by 03–06 and later folded behind the `GameAdapter`
  (09).
- `pnpm --dir agent test` — `__tests__/engine.test.ts` covers replay
  determinism (same seed ⇒ identical state) and outcome ranking.
