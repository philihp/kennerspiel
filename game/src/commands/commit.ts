import { GameCommand, GameState, GameStatusEnum } from '../types'

export const commit: GameCommand = (state: GameState) => {
  if (state.status !== GameStatusEnum.PLAYING) return undefined
  if (state?.rondel?.pointingBefore === undefined) return undefined
  return {
    ...state,
    activePlayerIndex: (state.activePlayerIndex + 1) % state.numberOfPlayers,
    rondel: {
      ...state.rondel,
      pointingBefor: (state.rondel.pointingBefore + 1) % 13,
    },
  }
}
