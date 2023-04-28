import { always, ap, curry, pipe, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { coinCostOptions, costMoney, parseResourceParam } from '../board/resource'
import { GameStatePlaying, Tableau } from '../types'

export const forgersWorkshop = (param = '') => {
  const input = parseResourceParam(param)
  const coins = costMoney(input)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ reliquary: coins >= 5 ? 1 : 0 }),
      getCost({ reliquary: Math.floor((coins - 5) / 10) })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      return [...unnest(ap<Tableau, string>([coinCostOptions(15), coinCostOptions(5)], [player])), '']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
