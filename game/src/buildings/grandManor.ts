import { identity, pipe } from 'ramda'
import { allOccupiedBuildingsUsable } from '../board/frame'
import { payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const grandManor = (input = '') => {
  const { whiskey = 0 } = parseResourceParam(input)
  if (whiskey === 0) return identity
  return pipe(
    //
    withActivePlayer(payCost({ whiskey })),
    allOccupiedBuildingsUsable
  )
}
