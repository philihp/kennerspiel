import { always, any, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, withActivePlayer } from '../board/player'
import {
  GameCommandFellTreesParams,
  Tile,
  BuildingEnum,
  GameCommandEnum,
  StateReducer,
  GameStatePlaying,
} from '../types'
import { standardSesourceGatheringAction, updateToken, withRondel } from '../board/rondel'
import { checkNotBonusRound, oncePerFrame } from '../board/frame'
import { forestLocations, forestLocationsForCol } from '../board/landscape'
import { shortGameBonusProduction } from '../board/resource'

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

export const fellTrees = ({ row, col, useJoker }: GameCommandFellTreesParams): StateReducer =>
  pipe(
    //
    oncePerFrame(GameCommandEnum.FELL_TREES),
    checkNotBonusRound,
    standardSesourceGatheringAction('wood', useJoker),
    removeForestAt(row, col),
    withRondel(updateToken('wood', useJoker)),
    shortGameBonusProduction({ wood: 1 })
  )

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] => {
    const player = view(activeLens(state), state)
    return (
      match<string[], string[]>(partial)
        .with([], () => {
          if (checkNotBonusRound(state) === undefined) return []
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
          if (tile?.[1] !== BuildingEnum.Forest) return []
          const options = []
          if (state?.rondel?.wood !== undefined) options.push('')
          if (state?.rondel?.joker !== undefined) options.push('Jo')
          return options
        })
        .with([GameCommandEnum.FELL_TREES, P._, P._, 'Jo'], always(['']))
        .otherwise(always([]))
    )
  }
