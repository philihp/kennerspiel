import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const townEstate = (param = '') => {
  const { pottery = 0 } = parseResourceParam(param)
  if (pottery === 0) return (state: GameStatePlaying | undefined) => state
  return withActivePlayer(
    pipe(
      //
      payCost({ pottery }),
      getCost({ nickel: 2, penny: 2 })
    )
  )
}
