import { getCost, withActivePlayer } from '../board/player'
import { StateReducer, Tableau } from '../types'

const coinsForSheep = (sheep: number) => (sheep >= 9 ? 1 : 0) + (sheep >= 5 ? 2 : 0) + (sheep >= 1 ? 3 : 0)

export const spinningMill = (): StateReducer => {
  return withActivePlayer((player) => {
    return getCost({
      penny: coinsForSheep(player?.sheep ?? 0),
    })(player)
  })
}
