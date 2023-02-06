import { pipe } from 'ramda'
import { getCost, subtractCoins, withActivePlayer } from '../board/player'
import { GameStatePlaying } from '../types'

export const grainStorage = (param = '') => {
  if (param === '') return (state: GameStatePlaying | undefined) => state
  return withActivePlayer(
    pipe(
      //
      subtractCoins(1),
      getCost({ grain: 6 })
    )
  )
}
