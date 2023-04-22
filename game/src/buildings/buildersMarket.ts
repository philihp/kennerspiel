import { always, curry, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { Cost, GameStatePlaying, Tableau } from '../types'

const checkWorthTwoCoins =
  (input: Cost) =>
  (player: Tableau | undefined): Tableau | undefined =>
    costMoney(input) >= 2 ? player : undefined

export const buildersMarket = (param = '') => {
  const inputs = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      checkWorthTwoCoins(inputs),
      payCost(inputs),
      getCost({ wood: 2, clay: 2, stone: 1, straw: 1 })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      if (costMoney(view(activeLens(state), state)) < 2) return ['']
      return ['PnPn', '']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
