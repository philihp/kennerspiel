import { GameCommand, GameState, GameStatusEnum } from '../types'

export const start: GameCommand = (state: GameState) => {
  if (state.status !== GameStatusEnum.SETUP) {
    return undefined
  }
  return {
    ...state,
    status: GameStatusEnum.PLAYING,
  }
}
