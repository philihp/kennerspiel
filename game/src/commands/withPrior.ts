import { isPrior } from '../board/player'
import { GameStatePlaying, NextUseClergy } from '../types'

export const withPrior = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.players[state.frame.activePlayerIndex].clergy.some(isPrior) === false) return undefined
  return {
    ...state,
    frame: {
      ...state.frame,
      nextUse: NextUseClergy.OnlyPrior,
    },
  }
}
