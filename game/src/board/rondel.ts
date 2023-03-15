import { Rondel, GameCommandConfigParams, StateReducer, Cost } from '../types'
import { getCost, withActivePlayer } from './player'
import { multiplyGoods } from './resource'

type TokenName = 'grain' | 'sheep' | 'clay' | 'coin' | 'wood' | 'joker' | 'peat' | 'grape' | 'stone'

export const withRondel =
  (func: (rondel: Rondel | undefined) => Rondel | undefined): StateReducer =>
  (state) => {
    if (state === undefined) return state
    const rondel = func(state.rondel)
    if (rondel === undefined) return undefined
    return {
      ...state,
      rondel,
    }
  }

export const updateRondel =
  (token: TokenName) =>
  (rondel: Rondel | undefined): Rondel | undefined => {
    if (rondel === undefined) return undefined
    if (rondel[token] === undefined) return rondel
    return {
      ...rondel,
      [token]: rondel[token] !== undefined ? rondel.pointingBefore : rondel[token],
    }
  }

const introduceToken = (token: 'grape' | 'stone') =>
  withRondel((rondel) => {
    if (rondel === undefined) return undefined
    if (rondel[token] !== undefined) return rondel
    return {
      ...rondel,
      [token]: rondel.pointingBefore,
    } as Rondel
  })
export const introduceGrapeToken: StateReducer = (state) => {
  if (state?.config?.country !== 'france') return state
  return introduceToken('grape')(state)
}
export const introduceStoneToken: StateReducer = introduceToken('stone')

export const armValues = ({ length, players }: GameCommandConfigParams) => {
  if (players === 2 && length === 'short') {
    return [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 10]
  }
  return [0, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10]
}

export const take = (armIndex: number, tokenIndex: number, config: GameCommandConfigParams): number => {
  const armVals = armValues(config)
  return armVals[(armIndex - tokenIndex + armVals.length) % armVals.length]
}

export const takePlayerJoker =
  (unitCost: Cost): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const {
      rondel: { pointingBefore, joker },
      config,
    } = state
    const takeValue = take(pointingBefore, joker ?? pointingBefore, config)
    return withActivePlayer(getCost(multiplyGoods(takeValue)(unitCost)))(state)
  }

export const advanceJokerOnRondel: StateReducer = (state) =>
  state && {
    ...state,
    rondel: {
      ...state.rondel,
      joker: state.rondel.pointingBefore,
    },
  }
