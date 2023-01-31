import { GameStatePlaying } from '../types'

export const consumeMainAction = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  state && {
    ...state,
    mainActionUsed: true,
  }
