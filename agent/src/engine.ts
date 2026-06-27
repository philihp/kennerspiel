// Adapter over the game engine: the small, search-oriented surface MCTS and
// the policies need. A "move" is one complete command (e.g. ['USE','LR2'] or
// ['BUILD','G07','3','2'] or ['COMMIT']).

import { count } from 'ramda'
import { reducer, control, initialState, GameStatusEnum } from 'hathora-et-labora-game'
import type { GameState, Score } from 'hathora-et-labora-game'

export type Move = string[]
export { initialState }

// The reducer throws on commands it cannot parse; normalize that (and ordinary
// illegal moves) to undefined.
export const apply = (state: GameState, move: Move): GameState | undefined => {
  try {
    return reducer(state, move)
  } catch {
    return undefined
  }
}

export const replay = (commands: Move[]): GameState | undefined =>
  commands.reduce<GameState | undefined>((state, cmd) => (state === undefined ? undefined : apply(state, cmd)), initialState)

export const isPlaying = (state: GameState): boolean => state.status === GameStatusEnum.PLAYING

export const isTerminal = (state: GameState): boolean => state.status === GameStatusEnum.FINISHED

// The player we need input from at this node. Differs from currentPlayerIndex
// only during interrupts (e.g. WORK_CONTRACT). This is the "player to move".
export const playerToMove = (state: GameState): number => state.frame!.activePlayerIndex

export const numPlayers = (state: GameState): number => state.config!.players

// Per-player score breakdown (totals etc.) — valid mid-game and at terminal.
export const scores = (state: GameState): Score[] => control(state, []).score

// Terminal reward as a per-player value vector in [0, 1], higher = better.
// Rank-based so it generalizes past 2 players: a player scores
// (#opponents beaten + 0.5 * #ties) / (#opponents). 2p → win 1 / draw .5 / loss 0.
export const outcome = (state: GameState): number[] => {
  const totals = scores(state).map((s) => s.total)
  const n = totals.length
  if (n === 1) return [totals[0]!] // solo: raw score (no opponents to rank against)
  return totals.map((mine, i) => {
    const others = totals.filter((_, j) => j !== i)
    const beaten = count((t) => mine > t, others)
    const tied = count((t) => mine === t, others)
    return (beaten + 0.5 * tied) / (n - 1)
  })
}
