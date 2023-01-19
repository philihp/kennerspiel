import { GameStatePlaying } from '../types'

export const carpentry =
  (row: number, col: number) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    return state
  }
