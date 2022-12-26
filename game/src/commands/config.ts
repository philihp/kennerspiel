import { GameCommandConfigParams, GameState, GameStatusEnum } from '../types'

export const config = (state: GameState, params: GameCommandConfigParams): GameState | undefined => {
  if (state.status !== GameStatusEnum.SETUP) return undefined
  return {
    ...state,
    config: params,
    rondel: {
      pointingBefore: 0,
    },
  }
}
