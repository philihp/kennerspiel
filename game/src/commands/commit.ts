import { GameCommand, GameState, GameStatusEnum } from '../types'

export const commit: GameCommand = (state: GameState) => {
  if (state.status !== GameStatusEnum.PLAYING) {
    return undefined
  }
  return {
    ...state,
    activePlayerIndex: (state.activePlayerIndex + 1) % state.numberOfPlayers,
  }
}
