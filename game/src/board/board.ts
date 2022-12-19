import { GameState, GameStatusEnum } from '../types'
import { setPlayer } from './player'

export const preMove = (state: GameState): GameState | undefined => {
  let newState = state
  if (state.status !== GameStatusEnum.PLAYING) return undefined
  if (state.players === undefined) return undefined

  // TODO: isExtraRound
  // TODO: isSettling

  if (state?.moveInRound === 1) {
    state.players.forEach((player, i) => {
      if (player.clergy.length === 0) {
        // clergy are all placed
        newState = setPlayer(newState, player, i)
      }
    })
  }

  return newState
}
