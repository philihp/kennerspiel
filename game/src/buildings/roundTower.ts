import { always, curry, identity, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getWonder, payCost, withActivePlayer } from '../board/player'
import { costPoints, parseResourceParam } from '../board/resource'
import { removeWonder } from '../board/state'
import { CostReducer, GameStatePlaying } from '../types'

const removeWhiskey: CostReducer = (cost) => {
  if (!cost) return undefined
  if (!cost.whiskey) return undefined
  return {
    ...cost,
    whiskey: cost.whiskey - 1,
  }
}

const removeFiveCoins: CostReducer = (cost) => {
  if (!cost) return undefined
  if ((cost.penny ?? 0) >= 5)
    return {
      ...cost,
      penny: (cost.penny ?? 0) - 5,
    }
  if ((cost.nickel ?? 0) >= 1)
    return {
      ...cost,
      nickel: (cost.nickel ?? 0) - 1,
    }
  return undefined
}

export const roundTower = (param = '') => {
  const rawInput = parseResourceParam(param)
  const input = pipe(
    //
    removeWhiskey,
    removeFiveCoins
  )(rawInput)
  if (!input || costPoints(input) < 14) return identity
  return pipe(
    withActivePlayer(
      pipe(
        //
        payCost(rawInput),
        getWonder()
      )
    ),
    removeWonder
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
