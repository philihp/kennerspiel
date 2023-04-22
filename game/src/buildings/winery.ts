import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const winery = (input = '') => {
  const { wine = 0, grape = 0 } = parseResourceParam(input)
  return withActivePlayer(
    pipe(
      //
      payCost({ grape }),
      getCost({ wine: grape }),
      payCost({ wine }),
      getCost({
        nickel: (wine ?? 0) > 0 ? 1 : 0,
        penny: (wine ?? 0) > 0 ? 2 : 0,
      })
    )
  )
}
