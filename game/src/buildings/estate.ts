import { always, ap, concat, converge, curry, lift, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import {
  concatStr,
  costEnergy,
  costFood,
  energyCostOptions,
  foodCostOptions,
  parseResourceParam,
} from '../board/resource'
import { GameStatePlaying } from '../types'

export const estate = (param = '') => {
  const input = parseResourceParam(param)
  const iterations = Math.min(Math.floor(costEnergy(input) / 6) + Math.floor(costFood(input) / 10), 2)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ book: iterations, ornament: iterations })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      const energy6food0 = energyCostOptions(6, player)
      const energy0food10 = foodCostOptions(10, player)
      return [
        ...energyCostOptions(12, player),
        ...lift(concatStr)(energy6food0, energy0food10),
        ...foodCostOptions(20, player),
        ...energy6food0,
        ...energy0food10,
      ]
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
