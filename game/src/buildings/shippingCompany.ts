import { always, ap, concat, curry, identity, map, pipe, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, payCost, withActivePlayer } from '../board/player'
import {
  costEnergy,
  costFood,
  energyCostOptions,
  parseResourceParam,
  shortGameBonusProduction,
} from '../board/resource'
import { advanceJokerOnRondel, takePlayerJoker } from '../board/rondel'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'

export const shippingCompany = (inputRaw = ''): StateReducer => {
  const input = parseResourceParam(inputRaw)
  const { coal, peat, wood, straw } = input
  if (costEnergy({ coal, peat, wood, straw }) < 3) return identity

  const output = match(input)
    .with({ meat: P.when((n) => n && n > 0) }, () => ({ meat: 1 }))
    .with({ bread: P.when((n) => n && n > 0) }, () => ({ bread: 1 }))
    .with({ wine: P.when((n) => n && n > 0) }, () => ({ wine: 1 }))
    .otherwise(() => ({}))
  if (costFood(output) === 0) return () => undefined

  return pipe(
    //
    withActivePlayer(payCost({ coal, peat, wood, straw })),
    takePlayerJoker(output),
    advanceJokerOnRondel,
    shortGameBonusProduction(output)
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => [
      ...ap<string, string>(
        [
          //
          concat(ResourceEnum.Meat),
          concat(ResourceEnum.Bread),
          concat(ResourceEnum.Wine),
        ],
        energyCostOptions(3, view(activeLens(state), state))
      ),
      '',
    ])
    .with([P._], always(['']))
    .otherwise(always([]))
)
