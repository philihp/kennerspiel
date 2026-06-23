import { always, curry, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { addBonusAction } from '../board/frame'
import { activeLens, withActivePlayer } from '../board/player'
import { BuildingEnum, GameCommandEnum, GameState } from '../types'
import { forestLocations, forestLocationsForCol } from '../board/landscape'

const checkSpotIsForest = (col: number, row: number) =>
  withActivePlayer((player) => {
    if (player.landscape[row + player.landscapeOffset][col + 2][1] !== BuildingEnum.Forest) return undefined
    return player
  })

const removeForestAt = (col: number, row: number) =>
  withActivePlayer(
    (player) =>
      player && {
        ...player,
        landscape: [
          ...player.landscape.slice(0, row + player.landscapeOffset),
          [
            ...player.landscape[row + player.landscapeOffset].slice(0, col + 2),
            [player.landscape[row + player.landscapeOffset][col + 2][0]],
            ...player.landscape[row + player.landscapeOffset].slice(col + 2 + 1),
          ],
          ...player.landscape.slice(row + player.landscapeOffset + 1),
        ],
      }
  )

export const carpentry = (col: number, row: number) =>
  pipe(
    //
    checkSpotIsForest(col, row),
    removeForestAt(col, row),
    addBonusAction(GameCommandEnum.BUILD)
  )

export const complete = curry((partial: string[], state: GameState): string[] => {
  const player = view(activeLens(state), state)
  return match(partial)
    .with([], () => [...forestLocations(player), ''])
    .with([P._], ([c]) => {
      return [...forestLocationsForCol(c, player)]
    })
    .with([P._, P._], always(['']))
    .otherwise(always([]))
})
