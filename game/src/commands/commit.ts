import { GameCommand, GameState, GameStatusEnum } from '../types'

export const commit: GameCommand = (state: GameState) => {
  if (state.status !== GameStatusEnum.PLAYING) return undefined
  if (state?.rondel?.pointingBefore === undefined) return undefined
  if (state.config?.players === undefined) return undefined
  return {
    ...state,
    activePlayerIndex: (state.activePlayerIndex + 1) % state.config.players,
    rondel: {
      ...state.rondel,
      pointingBefore: (state.rondel.pointingBefore + 1) % 13,
    },
  }
}
