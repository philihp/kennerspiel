import { GameCommand, GameState, GameStatusEnum } from '../types'

export const start: GameCommand = (state: GameState) => {
  if (state.status !== GameStatusEnum.SETUP) return undefined
  if (state.rondel === undefined) return undefined
  if (state.config === undefined) return undefined
  return {
    ...state,
    status: GameStatusEnum.PLAYING,
    rondel: {
      ...state.rondel,
      wood: 0,
      clay: 0,
      coin: 0,
      joker: 0,
    },
  }
}
