import { map } from 'ramda'
import { GameStatePlaying } from '../../types'
import { clergyForColor, withEachPlayer } from '../player'
import { tileWithoutClergy } from '../tile'

export const returnClergyIfPlaced = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  withEachPlayer((player) => {
    if (player.clergy.length > 0) return player
    const clergy = clergyForColor(player.color)
    const landscapeWithoutClergy = map(map(tileWithoutClergy(clergy)))(player.landscape)
    return {
      ...player,
      clergy,
      landscape: landscapeWithoutClergy,
    }
  })(state)
