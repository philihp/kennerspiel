import { match } from 'ts-pattern'
import { pipe } from 'ramda'
import { getCost, withActivePlayer } from '../board/player'
import { GameCommandFellTreesParams, GameStatePlaying, Tile, BuildingEnum, Tableau } from '../types'
import { take } from '../board/wheel'
import { consumeMainAction } from '../board/state'

const checkStateAllowsUse = (state: GameStatePlaying | undefined) => {
  return match(state)
    .with(undefined, () => undefined)
    .with({ turn: { mainActionUsed: false } }, () => state)
    .with({ turn: { mainActionUsed: true } }, () => undefined)
    .exhaustive()
}

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

export const givePlayerWood =
  (useJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const { joker, wood, pointingBefore } = state.rondel
    const amount = take(pointingBefore, (useJoker ? joker : wood) ?? pointingBefore, state.config)
    return withActivePlayer(getCost({ wood: amount }))(state)
  }

const updateWoodRondel = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  state && {
    ...state,
    rondel: {
      ...state.rondel,
      wood: state.rondel.wood !== undefined ? state.rondel.pointingBefore : state.rondel.wood,
    },
  }

const updateJokerRondel = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  state && {
    ...state,
    rondel: {
      ...state.rondel,
      joker: state.rondel.joker !== undefined ? state.rondel.pointingBefore : state.rondel.joker,
    },
  }

export const fellTrees = ({ row, col, useJoker }: GameCommandFellTreesParams) =>
  pipe(
    //
    checkStateAllowsUse,
    consumeMainAction,
    givePlayerWood(useJoker),
    removeForestAt(row, col),
    useJoker ? updateJokerRondel : updateWoodRondel
  )
