import { map } from 'ramda'
import { StateReducer } from '../../types'
import { clergyForColor, withEachPlayer } from '../player'
import { tileWithoutClergy } from '../tile'

export const returnClergyIfPlaced: StateReducer = (state) => {
  if (state === undefined) return undefined
  return withEachPlayer((player) => {
    if (player.clergy.length > 0) return player
    const clergy = clergyForColor(state.config)(player.color)
    const landscapeWithoutClergy = map(map(tileWithoutClergy(clergy)))(player.landscape)
    return {
      ...player,
      clergy,
      landscape: landscapeWithoutClergy,
    }
  })(state)
}
