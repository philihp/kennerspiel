import { getPlayer, isPrior } from '../board/player'
import { GameStatePlaying, NextUseClergy } from '../types'

export const withPrior = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (getPlayer(state).clergy.some(isPrior) === false) return undefined
  return {
    ...state,
    turn: {
      ...state.turn,
      nextUse: NextUseClergy.OnlyPrior,
    },
  }
}
