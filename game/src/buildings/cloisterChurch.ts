import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const cloisterChurch = (param = '') => {
  const inputs = parseResourceParam(param)
  const reliquary = Math.min(2, inputs.bread ?? 0, inputs.wine ?? 2)
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ reliquary })
    )
  )
}
