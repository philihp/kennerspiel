import { pipe } from 'ramda'
import { subtractCoins, withActivePlayer } from '../board/player'
import { GameStatePlaying, Tableau } from '../types'

const checkPlayerHasPenny = (player: Tableau | undefined): Tableau | undefined => {
  if (player === undefined) return undefined
  if (player.penny === 0 && player.nickel === 0 && player.wine === 0 && player.whiskey === 0) return undefined
  return player
}

const addSixGrain = (player: Tableau | undefined): Tableau | undefined =>
  player && {
    ...player,
    grain: player.grain + 6,
  }

export const grainStorage =
  (param = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    return withActivePlayer(
      pipe(
        //
        checkPlayerHasPenny,
        subtractCoins(1),
        addSixGrain
      )
    )(state)
  }
