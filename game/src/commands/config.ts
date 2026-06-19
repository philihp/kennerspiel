import { GameCommandConfigParams, GameState } from '../types'

export const config =
  (params: GameCommandConfigParams) =>
  (state: GameState): GameState | undefined => {
    return {
      ...state,
      config: params,
      rondel: {
        pointingBefore: 0,
      },
    }
  }
