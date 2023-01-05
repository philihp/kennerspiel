import { getPlayer } from '../board/player'
import { GameCommandBuildParams, GameStatePlaying } from '../types'

export const build =
  ({ row, col, building }: GameCommandBuildParams) =>
  (state: GameStatePlaying): GameStatePlaying | undefined => {
    if (!state.buildings.includes(building)) return undefined

    const player = getPlayer(state)
    const [land, erection] = player.landscape[row][col]
    if (erection !== undefined) return undefined

    // check land type matches
    // check player has building cost
    // if this building is a cloister, make sure its next to another

    // === all good

    // remove building from unbuilt
    // add building at landscape
    // remove player resources

    return state
  }
