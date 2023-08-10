import { always, any, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, withActivePlayer } from '../board/player'
import { GameCommandCutPeatParams, Tile, BuildingEnum, GameCommandEnum, StateReducer, GameStatePlaying } from '../types'
import { standardSesourceGatheringAction, updateRondel, withRondel } from '../board/rondel'
import { checkNotBonusRound, oncePerFrame } from '../board/frame'
import { moorLocations, moorLocationsForCol } from '../board/landscape'
import { shortGameBonusProduction } from '../board/resource'

const removePeatAt = (row: number, col: number) =>
  withActivePlayer((player) => {
    const tile = player.landscape[row + player.landscapeOffset][col + 2]
    const [land, building] = tile
    if (building !== BuildingEnum.Moor) return undefined
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
      return tile?.[1] === BuildingEnum.Moor
    }, landRow)
  }, landscape)

export const cutPeat = ({ row, col, useJoker }: GameCommandCutPeatParams): StateReducer =>
  pipe(
    //
    oncePerFrame(GameCommandEnum.CUT_PEAT),
    checkNotBonusRound,
    standardSesourceGatheringAction('peat', useJoker),
    removePeatAt(row, col),
    withRondel(updateRondel(useJoker ? 'joker' : 'peat')),
    shortGameBonusProduction({ peat: 1 })
  )

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] => {
    const player = view(activeLens(state), state)
    return (
      match<string[], string[]>(partial)
        .with([], () => {
          if (checkNotBonusRound(state) === undefined) return []
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
          if (tile?.[1] === BuildingEnum.Moor) return ['', 'Jo']
          return []
        })
        .with([GameCommandEnum.CUT_PEAT, P._, P._, 'Jo'], always(['']))
        .otherwise(always([]))
    )
  }
