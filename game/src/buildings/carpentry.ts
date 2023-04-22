import { always, curry, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { addBonusAction } from '../board/frame'
import { activeLens, withActivePlayer } from '../board/player'
import { BuildingEnum, GameCommandEnum, GameStatePlaying } from '../types'
import { forestLocations, forestLocationsForCol } from '../board/landscape'

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

export const complete = curry((partial: string[], state: GameStatePlaying): string[] => {
  const player = view(activeLens(state), state)
  return match(partial)
    .with([], () => [...forestLocations(player), ''])
    .with([P._], ([c]) => {
      return [...forestLocationsForCol(c, player)]
    })
    .with([P._, P._], always(['']))
    .otherwise(always([]))
})
