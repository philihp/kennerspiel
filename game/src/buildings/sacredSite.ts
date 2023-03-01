import { getCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { StateReducer } from '../types'

export const sacredSite = (param = ''): StateReducer => {
  const { grain = 0, malt = 0, beer = 0, whiskey = 0 } = parseResourceParam(param)
  return withActivePlayer(
    //
    getCost({
      grain: grain && !malt ? 2 : 0,
      malt: malt && !grain ? 2 : 0,
      beer: beer && !whiskey ? 1 : 0,
      whiskey: whiskey && !beer ? 1 : 0,
      book: 1,
    })
  )
}
