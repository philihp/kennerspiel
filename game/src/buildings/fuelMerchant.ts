import { T, __, always, cond, curry, gte, identity, map, pipe, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costEnergy, energyCostOptions, parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const fuelMerchant = (param = '') => {
  const inputs = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      cond([
        [gte(__, 9), always(getCost({ nickel: 2 }))],
        [gte(__, 6), always(getCost({ nickel: 1, penny: 3 }))],
        [gte(__, 3), always(getCost({ nickel: 1 }))],
        [T, always(identity)],
      ])(costEnergy(inputs))
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      return unnest(
        map(
          // TODO: id like to flip energyCostOptions and then curry out the n, but it doesnt seem to work...
          (n) => energyCostOptions(n, view(activeLens(state), state)),
          // flip<number, Cost, string>(energyCostOptions)(view(activeLens(state), state)),
          [9, 6, 3, 0]
        )
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
