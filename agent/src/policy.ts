import type { GameState } from './game'
import type { Move } from './engine'
import type { Rng } from './rng'

// A policy chooses one move for the player-to-move. Returns undefined only if
// there is no legal move (a stuck/terminal state).
export type Policy = {
  name: string
  pick: (state: GameState, rng: Rng) => Move | undefined
}
