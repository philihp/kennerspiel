import { always, ap, concat, curry, identity, map, pipe, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, payCost, withActivePlayer } from '../board/player'
import { costEnergy, costFood, energyCostOptions, parseResourceParam } from '../board/resource'
import { advanceJokerOnRondel, takePlayerJoker } from '../board/rondel'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'

export const shippingCompany = (fuel = '', product = ''): StateReducer => {
  const input = parseResourceParam(fuel)
  if (costEnergy(input) < 3) return identity

  const output = match(parseResourceParam(product))
    .with({ meat: P.when((n) => n > 0) }, () => ({ meat: 1 }))
    .with({ bread: P.when((n) => n > 0) }, () => ({ bread: 1 }))
    .with({ wine: P.when((n) => n > 0) }, () => ({ wine: 1 }))
    .otherwise(() => ({}))
  if (costFood(output) === 0) return () => undefined

  return pipe(
    //
    withActivePlayer(payCost(input)),
    takePlayerJoker(output),
    advanceJokerOnRondel
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
