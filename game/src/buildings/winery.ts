import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const winery = (param1 = '', param2 = '') => {
  const input1 = parseResourceParam(param1)
  const input2 = parseResourceParam(param2)
  return withActivePlayer(
    pipe(
      //
      payCost(input1),
      getCost({
        wine: input1.grape ?? 0,
      }),
      payCost(input2),
      getCost({
        nickel: (input2.wine ?? 0) > 0 ? 1 : 0,
        penny: (input2.wine ?? 0) > 0 ? 2 : 0,
      })
    )
  )
}
