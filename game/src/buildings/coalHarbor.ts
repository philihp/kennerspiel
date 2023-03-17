import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { StateReducer } from '../types'

export const coalHarbor = (param = ''): StateReducer => {
  const { peat = 0 } = parseResourceParam(param)
  const iterations = Math.min(3, peat)
  return withActivePlayer(
    pipe(
      //
      payCost({ peat: iterations }),
      getCost({
        whiskey: iterations,
        penny: (3 * iterations) % 5,
        nickel: Math.floor((3 * iterations) / 5),
      })
    )
  )
}
