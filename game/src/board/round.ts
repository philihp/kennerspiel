import { GameState, GameStatusEnum, Tile } from '../types'
import { clergyForColor, setPlayer } from './player'

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
        const clergy = clergyForColor(player.color)
        const landscape = player.landscape.map((landRow) =>
          landRow.map((landStack) => {
            if (landStack.length >= 3 && landStack?.[2] !== undefined && clergy.includes(landStack[2]))
              return [...landStack.slice(0, 2), ...landStack.slice(3)] as Tile
            return landStack
          })
        )
        newState = setPlayer(
          newState,
          {
            ...player,
            clergy,
            landscape,
          },
          i
        )
      }
    })
  }

  return newState
}
