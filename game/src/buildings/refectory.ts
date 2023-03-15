import { identity, pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const refectory = (param = '') => {
  const { meat = 0 } = parseResourceParam(param)
  const iterations = Math.min(4, meat)
  return withActivePlayer(
    pipe(
      //
      getCost({ beer: 1, meat: 1 }),
      payCost({ meat: iterations }),
      getCost({ ceramic: iterations })
    )
  )
}
