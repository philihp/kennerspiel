import { addIndex, always, any, curry, map, pipe, reduce } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, withActivePlayer } from '../board/player'
import {
  GameCommandCutPeatParams,
  Tile,
  BuildingEnum,
  GameCommandEnum,
  StateReducer,
  GameStatePlaying,
  Tableau,
} from '../types'
import { take, updateRondel, withRondel } from '../board/rondel'
import { oncePerFrame } from '../board/frame'

const removePeatAt = (row: number, col: number) =>
  withActivePlayer((player) => {
    const tile = player.landscape[row + player.landscapeOffset][col + 2]
    const [land, building] = tile
    if (building !== BuildingEnum.Peat) return undefined
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
  })

const hasAMoor = (landscape: Tile[][]): boolean =>
  any((landRow: Tile[]) => {
    return any((tile: Tile): boolean => {
      return tile?.[1] === BuildingEnum.Peat
    }, landRow)
  }, landscape)

const moorLocationsForCol = (rawCol: string, player: Tableau): string[] => {
  const col = Number.parseInt(rawCol, 10) + 2
  const colsAtRow = map((row: Tile[]) => row[col], player.landscape)
  return addIndex<Tile, string[]>(reduce<Tile, string[]>)(
    (accum: string[], tile: Tile, rowIndex: number) => {
      if (tile[1] === BuildingEnum.Peat) accum.push(`${rowIndex - player.landscapeOffset}`)
      return accum
    },
    [] as string[],
    colsAtRow
  )
}

const moorLocations = (player: Tableau): string[] =>
  addIndex(reduce<Tile[], string[]>)(
    (accum: string[], row: Tile[], rowIndex: number) =>
      addIndex(reduce<Tile, string[]>)(
        (innerAccum: string[], tile: Tile, colIndex: number) => {
          if (tile[1] === BuildingEnum.Peat) innerAccum.push(`${colIndex - 2} ${rowIndex - player.landscapeOffset}`)
          return innerAccum
        },
        accum,
        row
      ),
    [] as string[],
    player.landscape
  )

const givePlayerPeat =
  (useJoker: boolean): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const { joker, peat, pointingBefore } = state.rondel
    const amount = take(pointingBefore, (useJoker ? joker : peat) ?? pointingBefore, state.config)
    return withActivePlayer(getCost({ peat: amount }))(state)
  }

export const cutPeat = ({ row, col, useJoker }: GameCommandCutPeatParams): StateReducer =>
  pipe(
    //
    oncePerFrame(GameCommandEnum.CUT_PEAT),
    givePlayerPeat(useJoker),
    removePeatAt(row, col),
    withRondel(updateRondel(useJoker ? 'joker' : 'peat'))
  )

export const complete = curry((state: GameStatePlaying, partial: string[]): string[] => {
  const player = state.players[state.frame.activePlayerIndex]
  return (
    match<string[], string[]>(partial)
      .with([], () => {
        if (!hasAMoor(player.landscape)) return []
        if (oncePerFrame(GameCommandEnum.CUT_PEAT)(state) === undefined) return []
        return [GameCommandEnum.CUT_PEAT]
      })
      .with([GameCommandEnum.CUT_PEAT], () => moorLocations(player))
      // shouldnt actually ever see this, but i think its important for completeness
      .with([GameCommandEnum.CUT_PEAT, P._], (_, [, c]) => moorLocationsForCol(c, player))
      .with([GameCommandEnum.CUT_PEAT, P._, P._], (_, [, c, r]) => {
        const row = Number.parseInt(r, 10) + player.landscapeOffset
        const col = Number.parseInt(c, 10) + 2
        const tile = player.landscape?.[row]?.[col]
        if (tile?.[1] === BuildingEnum.Peat) return ['']
        return []
      })
      .otherwise(always([]))
  )
})
