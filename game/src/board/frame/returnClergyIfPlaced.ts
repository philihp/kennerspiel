import { map } from 'ramda'
import { clergyForColor, withEachPlayer } from '../player'
import { tileWithoutClergy } from '../tile'

export const returnClergyIfPlaced = withEachPlayer((player) => {
  if (player.clergy.length > 0) return player
  const clergy = clergyForColor(player.color)
  const landscapeWithoutClergy = map(map(tileWithoutClergy(clergy)))(player.landscape)
  return {
    ...player,
    clergy,
    landscape: landscapeWithoutClergy,
  }
})
