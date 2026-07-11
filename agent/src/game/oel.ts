// The one concrete GameAdapter: Ora et Labora. Implemented by DELEGATION to the
// internal engine.ts / moves.ts modules (and the game package), not by
// reimplementation — so those modules stay independently testable and a second
// game would get its own internal modules the same way.

import type { GameState } from 'hathora-et-labora-game'
import { encodeInto, featureSpec } from 'hathora-et-labora-game'
import { apply, replay, isTerminal, playerToMove, numPlayers, outcome as engineOutcome, scores } from '../engine'
import type { Move } from '../engine'
import { enumerateMoves, sampleMove } from '../moves'
import type { GameAdapter } from './adapter'

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

// Solo value squash: engine.outcome returns the raw score for 1-player games,
// which violates the [0,1] contract (it would swamp UCT's exploration term and
// saturate the sigmoid value head). Map it through σ((score − target)/scale):
// 0.5 exactly at the score-500 success threshold, monotone in score. The binary
// "score > 500" rate stays the *reported* metric (docs 22/26); this squash is
// only what search backs up and the net trains on.
const SOLO = { target: 500, scale: 100 }
const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x))

// join-space key; canonical enough for dedupe once moves are canonicalized.
const moveKey = (move: Move): string => move.join(' ')

export const oel: GameAdapter<GameState, Move, GameConfig> = {
  name: 'oel',
  opening,
  initial: (cfg, seed) => {
    const state = replay(opening(cfg, seed))
    if (state === undefined) throw new Error(`bad opening: ${JSON.stringify(opening(cfg, seed))}`)
    return state
  },
  apply,
  isTerminal,
  playerToMove,
  numPlayers,
  outcome: (state) =>
    numPlayers(state) === 1 ? [sigmoid((engineOutcome(state)[0]! - SOLO.target) / SOLO.scale)] : engineOutcome(state),
  // Identity canonicalization for now (the DFS already yields distinct paths);
  // project 10 canonicalizes and dedupes by `moveKey` here.
  legalMoves: (state, caps) => enumerateMoves(state, caps),
  sampleMove,
  moveKey,
  heuristic: (state) => scores(state).map((s) => s.total),
  featureSpec,
  encodeState: (state, perspective, out) => encodeInto(state, perspective, out),
  actionSpec: { version: 0 },
  encodeMove: () => {
    throw new Error('oel.encodeMove: not implemented until project 11 (ActionSpec & move encoder)')
  },
}
