import { stepState } from 'pcg'
import { assoc, dissoc, head, tail } from 'ramda'
import { GameState, StateReducer } from '../types'

// Each command that uses the randomizer takes one unix timestamp (in seconds)
// from state.timestamps, and steps the pcg forward by that distance before any
// draw. The caller supplies the timestamps: the stored list when it replays a
// game, or [now] when it applies a new move. A command steps only one time,
// even if it draws more than one number.

export const withTimestamps =
  (timestamps: number[]) =>
  (state: GameState): GameState =>
    assoc('timestamps', timestamps, state)

export const beginCommand = (state: GameState): GameState => assoc('entropyStepped', false, state)

export const endCommand: StateReducer = (state) => state && dissoc('entropyStepped', state)

export const stepWithTimestamp: StateReducer = (state) => {
  if (state === undefined || state.entropyStepped === true) return state
  const timestamp = head(state.timestamps ?? [])
  if (timestamp === undefined || state.randGen === undefined) return assoc('entropyStepped', true, state)
  return {
    ...state,
    randGen: stepState(timestamp, state.randGen),
    timestamps: tail(state.timestamps ?? []),
    entropyStepped: true,
  }
}

// how many of the supplied timestamps the commands used, from the state before and after
export const timestampsUsed = (before: GameState, after: GameState): number =>
  (before.timestamps ?? []).length - (after.timestamps ?? []).length
