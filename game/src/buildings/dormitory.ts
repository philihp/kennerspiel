import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const dormitory = (param = '') => {
  const input = parseResourceParam(param)
  const iterations = Math.min((input.straw ?? 0) + (input.grain ?? 0), input.wood ?? 0)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ pottery: 1, book: iterations })
    )
  )
}
