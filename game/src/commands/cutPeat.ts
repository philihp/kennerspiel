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
  any(
    any((tile: Tile) => {
      return tile?.[1] === BuildingEnum.Peat
    }),
    landscape
  )

const moorLocationsForRow = (player: Tableau, rawRow: string): string[] => {
  const row = Number.parseInt(rawRow, 10)
  const rowOfTiles = player.landscape[row + player.landscapeOffset]
  return addIndex(reduce<Tile, string[]>)(
    (accum, tile, colIndex) => {
      if (tile?.[1] === BuildingEnum.Peat) accum.push(`${colIndex - 2}`)
      return accum
    },
    [] as string[],
    rowOfTiles
  )
}

const moorLocations = (player: Tableau): string[] =>
  addIndex(reduce<Tile[], string[]>)(
    (accum, _, rowIndex) => {
      accum.push(
        ...map(
          (colIndex) => `${rowIndex - player.landscapeOffset} ${colIndex}`,
          moorLocationsForRow(player, `${rowIndex - player.landscapeOffset}`)
        )
      )
      return accum
    },
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
      .with([GameCommandEnum.CUT_PEAT, P._], (_, [, r]) => moorLocationsForRow(player, r))
      .with([GameCommandEnum.CUT_PEAT, P._, P._], (_, [, r, c]) => {
        const row = Number.parseInt(r, 10)
        const col = Number.parseInt(c, 10) - 2
        const tile = player.landscape[row + player.landscapeOffset][col + 2]
        if (tile?.[1] === BuildingEnum.Forest) return ['']
        return []
      })
      .otherwise(always([]))
  )
})
