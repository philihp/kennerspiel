import { always, assoc, curry, dissoc, equals, isNil, pathSatisfies, pipe, propSatisfies, when } from 'ramda'
import { match } from 'ts-pattern'
import { Rondel, GameCommandConfigParams, StateReducer, Cost, GameStatePlaying } from '../types'
import { getCost, withActivePlayer } from './player'
import { multiplyGoods } from './resource'

type TokenName = 'grain' | 'sheep' | 'clay' | 'coin' | 'wood' | 'joker' | 'peat' | 'grape' | 'stone'

export const withRondel =
  (func: (rondel: Rondel) => Rondel | undefined): StateReducer =>
  (state) => {
    if (state === undefined) return state
    const rondel = func(state.rondel)
    if (rondel === undefined) return undefined
    return assoc('rondel', rondel, state)
  }

export const updateRondel =
  (token: TokenName) =>
  (rondel: Rondel | undefined): Rondel | undefined => {
    if (rondel === undefined) return undefined
    if (rondel[token] === undefined) return rondel
    return assoc(token, rondel[token] !== undefined ? rondel.pointingBefore : rondel[token])(rondel)
  }

const introduceToken = (token: 'grape' | 'stone' | 'joker') =>
  withRondel(
    pipe(
      when(isNil, always(undefined)),
      when(propSatisfies(isNil, token), (rondel: Rondel) => assoc(token, rondel.pointingBefore, rondel))
    )
  )

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

export const advanceJokerOnRondel: StateReducer = withRondel(
  (rondel) => rondel && assoc('joker', rondel.pointingBefore, rondel)
)

export const standardSesourceGatheringCompletion = curry((partial: string[], state: GameStatePlaying) =>
  match<string[], string[]>(partial)
    .with([], () => (state.rondel.joker !== undefined ? ['', 'Jo'] : ['']))
    .with(['Jo'], () => (state.rondel.joker !== undefined ? [''] : []))
    .otherwise(always([]))
)
