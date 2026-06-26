// Match harness: play seated policies against each other and score the result.
// Deterministic given seeds, so matches are reproducible.

import { apply, replay, isPlaying, isTerminal, playerToMove, scores, outcome } from './engine'
import type { Move } from './engine'
import { mulberry32, type Rng } from './rng'
import type { Policy } from './policy'

export type GameConfig = {
  players: number
  country: 'france' | 'ireland'
  length: 'short' | 'long'
  colors: string[]
}

export const CONFIG_2P_LONG: GameConfig = { players: 2, country: 'france', length: 'long', colors: ['R', 'G'] }
export const CONFIG_2P_SHORT: GameConfig = { players: 2, country: 'france', length: 'short', colors: ['R', 'G'] }

export const opening = (cfg: GameConfig, seed: number): Move[] => [
  ['CONFIG', String(cfg.players), cfg.country, cfg.length],
  ['START', String(seed), ...cfg.colors],
]

export type GameResult = {
  totals: number[]
  outcome: number[]
  steps: number
  finished: boolean
  commands: Move[]
}

// Play one game. policies[seat] chooses for that seat. Stops at a terminal
// state, when no legal move is offered, or at maxSteps (safety).
export const playGame = (
  policies: Policy[],
  cfg: GameConfig,
  seed: number,
  rng: Rng,
  maxSteps = 8000
): GameResult => {
  const commands = opening(cfg, seed)
  let state = replay(commands)
  if (state === undefined) throw new Error(`bad opening: ${JSON.stringify(commands)}`)
  let steps = 0
  while (isPlaying(state) && steps < maxSteps) {
    const seat = playerToMove(state)
    const policy = policies[seat % policies.length]!
    const move = policy.pick(state, rng)
    if (move === undefined) break
    const next = apply(state, move)
    if (next === undefined) break
    commands.push(move)
    state = next
    steps++
  }
  return {
    totals: scores(state).map((s) => s.total),
    outcome: outcome(state),
    steps,
    finished: isTerminal(state),
    commands,
  }
}

export type MatchOptions = { games: number; cfg?: GameConfig; baseSeed?: number }
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
// any first-player/turn-order advantage.
export const runMatch = (a: Policy, b: Policy, opts: MatchOptions): MatchResult => {
  const cfg = opts.cfg ?? CONFIG_2P_LONG
  const baseSeed = opts.baseSeed ?? 1
  let aWins = 0
  let bWins = 0
  let draws = 0
  let totalSteps = 0
  let finished = 0
  for (let g = 0; g < opts.games; g++) {
    const swap = g % 2 === 1
    const policies = swap ? [b, a] : [a, b]
    const seed = baseSeed + g
    const rng = mulberry32(seed * 7919 + 1)
    const res = playGame(policies, cfg, seed, rng)
    totalSteps += res.steps
    if (res.finished) finished++
    const aSeat = swap ? 1 : 0
    const bSeat = swap ? 0 : 1
    const ao = res.outcome[aSeat] ?? 0
    const bo = res.outcome[bSeat] ?? 0
    if (ao > bo) aWins++
    else if (bo > ao) bWins++
    else draws++
  }
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
    avgSteps: totalSteps / opts.games,
    finishedRate: finished / opts.games,
  }
}
