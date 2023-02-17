import { pipe } from 'ramda'
import { getCost, withActivePlayer } from '../board/player'
import { GameCommandCutPeatParams, Tile, BuildingEnum, GameCommandEnum, StateReducer } from '../types'
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
