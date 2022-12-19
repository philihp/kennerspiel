import {
  GameCommandConfigParams,
  GameConfigCountry,
  GameConfigLength,
  GameConfigPlayers,
  GameState,
  GameStatusEnum,
} from '../types'

type ConfigParser = (params: string[]) => GameCommandConfigParams

const BAD_PARSE: GameCommandConfigParams = {
  country: undefined,
  length: undefined,
  players: undefined,
}

export const parse: ConfigParser = (params) => {
  if (params === undefined) return BAD_PARSE
  if (params.length < 3) return BAD_PARSE
  const players = Number.parseInt(params[0], 10)
  if (players === undefined || Number.isNaN(players) || players < 1 || players > 4) return BAD_PARSE
  const country = params[1]
  if (!['ireland', 'france'].includes(country)) return BAD_PARSE
  const length = params[2]
  if (!['short', 'long'].includes(length)) return BAD_PARSE
  return {
    players: players as GameConfigPlayers,
    country: country as GameConfigCountry,
    length: length as GameConfigLength,
  }
}

export const config = (state: GameState, params: GameCommandConfigParams) => {
  if (state.status !== GameStatusEnum.SETUP) return undefined
  return {
    ...state,
    config: params,
    rondel: {
      pointingBefore: 0,
    },
  }
}
