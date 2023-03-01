import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'

export const scriptorium = (pennies = '') => {
  const input = parseResourceParam(pennies)
  const paid = Math.min(costMoney(input), 1)
  return withActivePlayer(
    pipe(
      payCost(input),
      getCost({
        book: paid,
        meat: paid,
        whiskey: paid,
      })
    )
  )
}
