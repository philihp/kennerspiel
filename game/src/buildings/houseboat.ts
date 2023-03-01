import { getCost, withActivePlayer } from '../board/player'
import { StateReducer } from '../types'

export const houseboat = (): StateReducer => {
  return withActivePlayer(
    getCost({
      wood: 1,
      malt: 1,
      penny: 1,
      peat: 1,
    })
  )
}
