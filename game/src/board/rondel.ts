import { always, assoc, curry, dissoc, equals, isNil, pathSatisfies, pipe, propSatisfies, when } from 'ramda'
import { match } from 'ts-pattern'
import {
  Rondel,
  GameCommandConfigParams,
  StateReducer,
  Cost,
  GameStatePlaying,
  ResourceEnum,
  RondelToken,
} from '../types'
import { getCost, withActivePlayer } from './player'
import { multiplyGoods, parseResourceParam } from './resource'

// eslint-disable-next-line consistent-return
const tokenToResource = (token: RondelToken): ResourceEnum | undefined => {
  switch (token) {
    case 'grain':
      return ResourceEnum.Grain
    case 'sheep':
      return ResourceEnum.Sheep
    case 'clay':
      return ResourceEnum.Clay
    case 'coin':
      return ResourceEnum.Penny
    case 'wood':
      return ResourceEnum.Wood
    case 'peat':
      return ResourceEnum.Peat
    case 'grape':
      return ResourceEnum.Grape
    case 'stone':
      return ResourceEnum.Stone
  }
}

export const withRondel = (func: (rondel: Rondel) => Rondel | undefined): StateReducer => {
  return (state) => {
    if (state === undefined) return state
    const rondel = func(state.rondel)
    if (rondel === undefined) return undefined
    return assoc('rondel', rondel, state)
  }
}

export const updateRondel = (token: RondelToken) => {
  return (rondel: Rondel | undefined): Rondel | undefined => {
    if (rondel === undefined) return undefined
    if (rondel[token] === undefined) return rondel
    return assoc(token, rondel[token] !== undefined ? rondel.pointingBefore : rondel[token])(rondel)
  }
}

const introduceToken = (token: 'grape' | 'stone' | 'joker') =>
  withRondel(when(propSatisfies(isNil, token), (rondel: Rondel) => assoc(token, rondel.pointingBefore, rondel)))

export const introduceGrapeToken: StateReducer = when(
  pathSatisfies(equals('france'), ['config', 'country']),
  introduceToken('grape')
)

export const introduceStoneToken: StateReducer = introduceToken('stone')
export const introduceJokerToken: StateReducer = introduceToken('joker')
export const removeJokerToken: StateReducer = withRondel(dissoc('joker'))

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

export const takePlayerJoker = (unitCost: Cost): StateReducer => {
  return (state) => {
    if (state === undefined) return undefined
    const {
      rondel: { pointingBefore, joker },
      config,
    } = state
    const takeValue = take(pointingBefore, joker ?? pointingBefore, config)
    return withActivePlayer(getCost(multiplyGoods(takeValue)(unitCost)))(state)
  }
}

export const advanceJokerOnRondel: StateReducer = withRondel(
  (rondel) => rondel && assoc('joker', rondel.pointingBefore, rondel)
)

export const updateToken = (withToken: RondelToken, withJoker: boolean) => (rondel: Rondel) => {
  if (withJoker) return updateRondel('joker')(rondel)
  if (rondel[withToken] === undefined) return updateRondel('joker')(rondel)
  return updateRondel(withToken)(rondel)
}

export const standardSesourceGatheringAction = (usingToken: RondelToken, withJoker: boolean): StateReducer => {
  return (state) => {
    if (state === undefined) return state
    const {
      config,
      rondel: { joker, pointingBefore },
    } = state
    const main = state.rondel[usingToken]
    const amount = take(pointingBefore, (withJoker ? joker : main ?? joker) ?? pointingBefore, config)
    const resource = tokenToResource(usingToken)
    const cost = parseResourceParam(resource)
    const magnitude = multiplyGoods(amount)(cost)
    return withActivePlayer(getCost(magnitude))(state)
  }
}

export const standardSesourceGatheringCompletion = curry(
  (usingToken: RondelToken, partial: string[], state: GameStatePlaying) => {
    const jokerAvailable = state.rondel.joker !== undefined
    const mainAvailable = state.rondel[usingToken] !== undefined
    return match<string[], string[]>(partial)
      .with([], () => {
        if (jokerAvailable && mainAvailable) return ['', 'Jo']
        if (jokerAvailable !== mainAvailable) return ['']
        return []
      })
      .with(['Jo'], () => (jokerAvailable ? [''] : []))
      .otherwise(always([]))
  }
)
