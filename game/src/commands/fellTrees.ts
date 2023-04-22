import { addIndex, always, any, curry, map, pipe, reduce } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, withActivePlayer } from '../board/player'
import {
  GameCommandFellTreesParams,
  Tile,
  BuildingEnum,
  GameCommandEnum,
  StateReducer,
  GameStatePlaying,
  Tableau,
} from '../types'
import { take } from '../board/rondel'
import { oncePerFrame } from '../board/frame'
import { forestLocations, forestLocationsForCol } from '../board/landscape'

const removeForestAt = (row: number, col: number) =>
  withActivePlayer((player) => {
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
  })

const hasAForest = (landscape: Tile[][]): boolean =>
  any((landRow: Tile[]) => {
    return any((tile: Tile): boolean => {
      return tile?.[1] === BuildingEnum.Forest
    }, landRow)
  }, landscape)

export const givePlayerWood =
  (useJoker: boolean): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const { joker, wood, pointingBefore } = state.rondel
    const amount = take(pointingBefore, (useJoker ? joker : wood) ?? pointingBefore, state.config)
    return withActivePlayer(getCost({ wood: amount }))(state)
  }

const updateWoodRondel: StateReducer = (state) =>
  state && {
    ...state,
    rondel: {
      ...state.rondel,
      wood: state.rondel.wood !== undefined ? state.rondel.pointingBefore : state.rondel.wood,
    },
  }

const updateJokerRondel: StateReducer = (state) =>
  state && {
    ...state,
    rondel: {
      ...state.rondel,
      joker: state.rondel.joker !== undefined ? state.rondel.pointingBefore : state.rondel.joker,
    },
  }

export const fellTrees = ({ row, col, useJoker }: GameCommandFellTreesParams): StateReducer =>
  pipe(
    //
    oncePerFrame(GameCommandEnum.FELL_TREES),
    givePlayerWood(useJoker),
    removeForestAt(row, col),
    useJoker ? updateJokerRondel : updateWoodRondel
  )

export const complete = curry((state: GameStatePlaying, partial: string[]): string[] => {
  const player = state.players[state.frame.activePlayerIndex]
  return (
    match<string[], string[]>(partial)
      .with([], () => {
        if (!hasAForest(player.landscape)) return []
        if (oncePerFrame(GameCommandEnum.FELL_TREES)(state) === undefined) return []
        return [GameCommandEnum.FELL_TREES]
      })
      .with([GameCommandEnum.FELL_TREES], () => forestLocations(player))
      // shouldnt actually ever see this, but i think its important for completeness
      .with([GameCommandEnum.FELL_TREES, P._], (_, [, c]) => forestLocationsForCol(c, player))
      .with([GameCommandEnum.FELL_TREES, P._, P._], (_, [, c, r]) => {
        const row = Number.parseInt(r, 10) + player.landscapeOffset
        const col = Number.parseInt(c, 10) + 2
        const tile = player.landscape?.[row]?.[col]
        if (tile?.[1] === BuildingEnum.Forest) return ['']
        return []
      })
      .otherwise(always([]))
  )
})
