import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const whiskeyDistillery = (input = '') => {
  const { malt = 0, wood = 0, peat = 0 } = parseResourceParam(input)
  const whiskey = 2 * Math.min(malt, wood, peat)
  return withActivePlayer(
    pipe(
      //
      payCost({ malt, wood, peat }),
      getCost({ whiskey })
    )
  )
}
