import { GameStatePlaying, GameStatusEnum } from '../../types'

export const gameEnd = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  if (state === undefined) return state
  return {
    ...state,
    status: GameStatusEnum.FINISHED,
  }
