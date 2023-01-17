import { GameStatePlaying } from '../types'

export const stoneMerchant =
  (param = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    return state
  }
