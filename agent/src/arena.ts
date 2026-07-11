// Match harness: play seated policies against each other and score the result.
// Deterministic given seeds, so matches are reproducible. Game-blind: reaches
// the game only through a GameAdapter.

import { sum } from 'ramda'
import type { GameAdapter } from './game/adapter'
import type { Policy } from './policy'
import { mulberry32, type Rng } from './rng'

// GameConfig / opening / the 2p presets moved to the OeL adapter (project 09);
// re-exported here so existing importers keep working.
export { CONFIG_2P_LONG, CONFIG_2P_SHORT, opening } from './game/oel'
export type { GameConfig } from './game/oel'

export type GameResult<TMove> = {
  totals: number[]
  outcome: number[]
  steps: number
  finished: boolean
  commands: TMove[]
}

// Play one game. policies[seat] chooses for that seat. Stops at a terminal
// state, when no legal move is offered, or at maxSteps (safety).
export const playGame = async <TState, TMove, TCfg>(
  adapter: GameAdapter<TState, TMove, TCfg>,
  policies: Policy<TState, TMove>[],
  cfg: TCfg,
  seed: number,
  rng: Rng,
  maxSteps = 8000
): Promise<GameResult<TMove>> => {
  const commands: TMove[] = [...adapter.opening(cfg, seed)] // replayable log incl. opening
  let state = adapter.initial(cfg, seed)
  let steps = 0
  while (!adapter.isTerminal(state) && steps < maxSteps) {
    const seat = adapter.playerToMove(state)
    const policy = policies[seat % policies.length]!
    const move = await policy.pick(state, rng)
    if (move === undefined) break
    const next = adapter.apply(state, move)
    if (next === undefined) break
    commands.push(move)
    state = next
    steps++
  }
  return {
    totals: adapter.heuristic?.(state) ?? [],
    outcome: adapter.outcome(state),
    steps,
    finished: adapter.isTerminal(state),
    commands,
  }
}

export type MatchOptions<TCfg> = { games: number; cfg: TCfg; baseSeed?: number }
export type MatchResult = {
  a: string
  b: string
  games: number
  aWins: number
  bWins: number
  draws: number
  aWinRate: number
  eloDiff: number
  avgSteps: number
  finishedRate: number
}

const eloFromWinRate = (p: number): number => {
  if (p <= 0) return -800
  if (p >= 1) return 800
  return Math.round(-400 * Math.log10(1 / p - 1))
}

// Head-to-head match. Alternates which policy takes seat 0 each game to cancel
// any first-player/turn-order advantage. Sequential (not Promise.all) so game
// order — and therefore any shared-process state — stays deterministic.
export const runMatch = async <TState, TMove, TCfg>(
  adapter: GameAdapter<TState, TMove, TCfg>,
  a: Policy<TState, TMove>,
  b: Policy<TState, TMove>,
  opts: MatchOptions<TCfg>
): Promise<MatchResult> => {
  const baseSeed = opts.baseSeed ?? 1

  const results: { winner: 'a' | 'b' | 'draw'; steps: number; finished: boolean }[] = []
  for (let g = 0; g < opts.games; g++) {
    const swap = g % 2 === 1 // alternate which policy sits at seat 0
    const seed = baseSeed + g
    const res = await playGame(adapter, swap ? [b, a] : [a, b], opts.cfg, seed, mulberry32(seed * 7919 + 1))
    const ao = res.outcome[swap ? 1 : 0] ?? 0
    const bo = res.outcome[swap ? 0 : 1] ?? 0
    results.push({ winner: ao > bo ? 'a' : bo > ao ? 'b' : 'draw', steps: res.steps, finished: res.finished })
  }

  const tally = (w: string) => results.filter((r) => r.winner === w).length
  const aWins = tally('a')
  const bWins = tally('b')
  const draws = tally('draw')
  const aWinRate = (aWins + 0.5 * draws) / opts.games
  return {
    a: a.name,
    b: b.name,
    games: opts.games,
    aWins,
    bWins,
    draws,
    aWinRate,
    eloDiff: eloFromWinRate(aWinRate),
    avgSteps: sum(results.map((r) => r.steps)) / opts.games,
    finishedRate: results.filter((r) => r.finished).length / opts.games,
  }
}
