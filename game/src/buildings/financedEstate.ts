import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { Cost, Tableau } from '../types'

const checkWorthOneCoin =
  (input: Cost) =>
  (player: Tableau | undefined): Tableau | undefined =>
    costMoney(input) >= 1 ? player : undefined

export const financedEstate = (param = '') => {
  const inputs = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      checkWorthOneCoin(inputs),
      payCost(inputs),
      getCost({ book: 1, bread: 1, grape: 2, flour: 2 })
    )
  )
}
