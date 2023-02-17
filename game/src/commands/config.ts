import { GameCommandConfigParams, GameStateSetup } from '../types'

export const config =
  (params: GameCommandConfigParams) =>
  (state: GameStateSetup): GameStateSetup | undefined => {
    return {
      ...state,
      config: params,
      rondel: {
        pointingBefore: 0,
      },
    }
  }
