import { identity, pipe } from 'ramda'
import { getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, StateReducer, TableauReducer } from '../types'

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
