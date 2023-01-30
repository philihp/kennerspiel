import { GameStatePlaying } from '../types'

export const checkMainActionNotUsed = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.mainActionUsed) return undefined
  return state
}

export const consumeMainAction = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  state && {
    ...state,
    mainActionUsed: true,
  }
