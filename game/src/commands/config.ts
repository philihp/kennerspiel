import { GameCommandConfigParams, GameState, GameStatusEnum } from '../types'

export const config = (state: GameState, params: GameCommandConfigParams) => {
  if (state.status !== GameStatusEnum.SETUP) return undefined
  if (params.players < 1 || params.players > 4) return undefined
  return {
    ...state,
    numberOfPlayers: params.players,
  }
}
