import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const peatCoalKiln = (param = '') => {
  const { peat = 0 } = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      getCost({ coal: 1 + peat, penny: 1 }),
      payCost({ peat })
    )
  )
}
