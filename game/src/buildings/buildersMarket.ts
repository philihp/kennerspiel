import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { Cost, Tableau } from '../types'

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
      getCost({ wood: 1, clay: 1, stone: 1, straw: 1 })
    )
  )
}
