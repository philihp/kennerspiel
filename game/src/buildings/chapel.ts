import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const chapel = (param = '') => {
  const { penny = 0, whiskey = 0, beer = 0 } = parseResourceParam(param)
  const book = Math.min(1, penny)
  const reliquary = Math.min(3, whiskey, beer)
  return withActivePlayer(
    pipe(
      //
      payCost({ penny, whiskey, beer }),
      getCost({ book, reliquary })
    )
  )
}
