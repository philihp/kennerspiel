import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'

export const cloisterLibrary = (pennies = '', books = '') => {
  const input = parseResourceParam(pennies)
  const paid = Math.min(costMoney(input), 3)
  const convert = Math.min(parseResourceParam(books).book ?? 0, 1)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ book: paid }),
      payCost({ book: convert }),
      getCost({ meat: convert, wine: convert })
    )
  )
}
