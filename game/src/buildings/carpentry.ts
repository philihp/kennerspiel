import { pipe } from 'ramda'
import { addBonusAction } from '../board/frame'
import { withActivePlayer } from '../board/player'
import { BuildingEnum, GameCommandEnum, GameStatePlaying } from '../types'

const checkSpotIsForest = (row: number, col: number) =>
  withActivePlayer((player) => {
    if (player.landscape[row][col + 2][1] !== BuildingEnum.Forest) return undefined
    return player
  })

const removeForestAt = (row: number, col: number) =>
  withActivePlayer(
    (player) =>
      player && {
        ...player,
        landscape: [
          ...player.landscape.slice(0, row),
          [
            ...player.landscape[row].slice(0, col + 2),
            [player.landscape[row][col + 2][0]],
            ...player.landscape[row].slice(col + 2 + 1),
          ],
          ...player.landscape.slice(row + 1),
        ],
      }
  )

export const carpentry = (row: number, col: number) =>
  pipe(
    //
    checkSpotIsForest(row, col),
    removeForestAt(row, col),
    addBonusAction(GameCommandEnum.BUILD)
  )
