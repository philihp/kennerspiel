import { always, curry, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, GameState, StateReducer, TableauReducer } from '../types'
import { forestLocations, forestLocationsForCol } from '../board/landscape'

// TODO: refactor this with carpentry

const checkSpotIsForest =
  (col: number, row: number): TableauReducer =>
  (player) => {
    if (player === undefined) return undefined
    if (player.landscape[row + player.landscapeOffset][col + 2][1] !== BuildingEnum.Forest) return undefined
    return player
  }

const removeForestAt =
  (col: number, row: number): TableauReducer =>
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

export const forestHut = (col?: number, row?: number): StateReducer => {
  if (col === undefined || row === undefined) return identity
  return withActivePlayer(
    pipe(
      //
      checkSpotIsForest(col, row),
      removeForestAt(col, row),
      getCost({ sheep: 2, wood: 2, stone: 1 })
    )
  )
}

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
