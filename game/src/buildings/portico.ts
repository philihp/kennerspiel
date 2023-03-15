import { identity, pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const portico = (param = '') => {
  const { reliquary = 0 } = parseResourceParam(param)
  if (reliquary < 1) return identity
  return withActivePlayer(
    pipe(
      payCost({ reliquary }),
      getCost({
        stone: 2,
        clay: 2,
        wood: 2,
        peat: 2,
        penny: 2,
        grain: 2,
        sheep: 2,
      })
    )
  )
}
