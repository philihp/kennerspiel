import {
  curry,
  dropLast,
  head,
  last,
  map,
  pipe,
  reduce,
  splitAt,
  splitEvery,
  startsWith,
  take,
  view,
  without,
} from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, GameStatePlaying, Tableau, Tile } from '../types'
import { forestLocations, forestLocationsForCol } from '../board/landscape'

const removeForestAt = (player: Tableau | undefined, [col, row]: [number, number]): Tableau | undefined => {
  if (player === undefined) return undefined
  const tile = player.landscape[row + player.landscapeOffset][col + 2]
  if (tile === undefined) return undefined
  const [land, building] = tile
  if (building !== BuildingEnum.Forest) return undefined
  const landscape = [
    ...player.landscape.slice(0, row + player.landscapeOffset),
    [
      ...player.landscape[row + player.landscapeOffset].slice(0, col + 2),
      // the tile in question
      [land] as Tile,
      ...player.landscape[row + player.landscapeOffset].slice(col + 2 + 1),
    ],
    ...player.landscape.slice(row + player.landscapeOffset + 1),
  ]
  return {
    ...player,
    landscape,
  }
}

export const printingOffice = (...coords: string[]) => {
  if (coords.length % 2 === 1) return () => undefined
  const pairs = take(4)(splitEvery(2)(map((n) => Number.parseInt(n, 10), coords))) as [number, number][]
  return withActivePlayer(
    pipe(
      //
      (state) => reduce(removeForestAt, state, pairs),
      getCost({ book: pairs.length })
    )
  )
}

const forestPairs = (player: Tableau) => (coords: string[]) => {
  const forestsAlreadyCutDown = pipe(
    //
    splitEvery(2),
    map<string[], string>(([a, b]) => `${a} ${b}`)
  )(coords)
  const forestsRemaining = pipe(
    //
    forestLocations,
    without(forestsAlreadyCutDown)
  )(player)

  return [...forestsRemaining, '']
}

const forestPairsWithColumn = (player: Tableau) => (coords: string[]) => {
  const coordPairs = splitEvery(2, coords)
  const completePairs = dropLast(1, coordPairs)
  const forestsCutDown = map(([a, b]) => `${a} ${b}`, completePairs)
  const allForestsRemaining = forestLocations(player)
  const forestsAfterCutDown = without(forestsCutDown, allForestsRemaining)
  const coordsAvail = reduce(
    (accum: string[], coordPair: string) => {
      const col = last(coords) ?? ''
      if (startsWith(`${col} `, coordPair)) {
        const [, row] = splitAt(col.length + 1, coordPair)
        accum.push(row)
      }
      return accum
    },
    [] as string[],
    forestsAfterCutDown
  )
  return coordsAvail
}

// TODO: this can be better
export const complete = curry((partial: string[], state: GameStatePlaying): string[] => {
  const player = view(activeLens(state), state)
  return match(partial)
    .with([], forestPairs(player))
    .with([P._], (coords: string[]) => forestLocationsForCol(head<string>(coords) ?? '', player))
    .with([P._, P._], forestPairs(player))
    .with([P._, P._, P._], forestPairsWithColumn(player))
    .with([P._, P._, P._, P._], forestPairs(player))
    .with([P._, P._, P._, P._, P._], forestPairsWithColumn(player))
    .with([P._, P._, P._, P._, P._, P._], forestPairs(player))
    .otherwise((param) => {
      const locations = param
      if (locations?.length === 7) {
        // well this is annoying, i can't check an array with more than 6 things?
        return forestPairsWithColumn(player)(locations)
      }
      if (locations?.length === 8) {
        return ['']
      }
      return []
    })
})
