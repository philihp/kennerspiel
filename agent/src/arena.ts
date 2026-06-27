// Match harness: play seated policies against each other and score the result.
// Deterministic given seeds, so matches are reproducible.

import { range, sum } from 'ramda'
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

  const results = range(0, opts.games).map((g) => {
    const swap = g % 2 === 1 // alternate which policy sits at seat 0
    const seed = baseSeed + g
    const res = playGame(swap ? [b, a] : [a, b], cfg, seed, mulberry32(seed * 7919 + 1))
    const ao = res.outcome[swap ? 1 : 0] ?? 0
    const bo = res.outcome[swap ? 0 : 1] ?? 0
    return { winner: ao > bo ? 'a' : bo > ao ? 'b' : 'draw', steps: res.steps, finished: res.finished }
  })

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
