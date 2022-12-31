import { GameCommandConfigParams, GameState, GameStateSetup } from '../types'

export const config = (state: GameStateSetup, params: GameCommandConfigParams): GameStateSetup | undefined => {
  return {
    ...state,
    config: params,
    rondel: {
      pointingBefore: 0,
    },
  }
}
