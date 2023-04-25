import { always, curry, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, GameStatePlaying, StateReducer, TableauReducer } from '../types'
import { forestLocations, forestLocationsForCol } from '../board/landscape'

// TODO: refactor this with carpentry

const checkSpotIsForest =
  (row: number, col: number): TableauReducer =>
  (player) => {
    if (player === undefined) return undefined
    if (player.landscape[row][col + 2][1] !== BuildingEnum.Forest) return undefined
    return player
  }

const removeForestAt =
  (row: number, col: number): TableauReducer =>
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

export const forestHut = (row?: number, col?: number): StateReducer => {
  if (row === undefined || col === undefined) return identity
  return withActivePlayer(
    pipe(
      //
      checkSpotIsForest(row, col),
      removeForestAt(row, col),
      getCost({ sheep: 2, wood: 2, stone: 1 })
    )
  )
}

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
