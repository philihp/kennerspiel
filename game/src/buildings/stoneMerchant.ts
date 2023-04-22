import { always, curry, map, min, pipe, range, reverse, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, withActivePlayer, payCost, activeLens } from '../board/player'
import { costEnergy, costFood, parseResourceParam, settlementCostOptions } from '../board/resource'
import { GameStatePlaying, StateReducer } from '../types'

export const stoneMerchant = (param = ''): StateReducer => {
  const inputs = parseResourceParam(param)
  const stone = Math.floor(Math.min(costEnergy(inputs), costFood(inputs) / 2, 5))
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ stone })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match<string[], string[]>(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      const food = Math.floor(costFood(player) / 2)
      const energy = costEnergy(player)
      const maxIterations = min(food, energy)
      const iterations = reverse(range(0, 1 + maxIterations)) // [ 0, 1, 2, 3, 4, 5 ]
      return unnest(map((i) => settlementCostOptions({ food: i * 2, energy: i }, player), iterations))
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
