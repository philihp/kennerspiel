import { GameState, GameStatusEnum } from '../types'

export const preMove = (state: GameState): GameState | undefined => {
  if (state.status !== GameStatusEnum.PLAYING) return undefined
  return state
}
