import { identity, pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const townEstate = (param = '') => {
  const { ceramic = 0 } = parseResourceParam(param)
  if (ceramic === 0) return identity
  return withActivePlayer(
    pipe(
      //
      payCost({ ceramic }),
      getCost({ nickel: 2, penny: 2 })
    )
  )
}
