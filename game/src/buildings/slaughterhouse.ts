import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const slaughterhouse = (param = '') => {
  const inputs = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ meat: Math.min(inputs.sheep ?? 0, inputs.straw ?? 0) })
    )
  )
}
