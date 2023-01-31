import { pipe } from 'ramda'
import { match } from 'ts-pattern'
import { getPlayer, setPlayerCurried } from '../board/player'
import { GameCommandCutPeatParams, GameStatePlaying, Tile, BuildingEnum, Tableau } from '../types'
import { take } from '../board/wheel'
import { consumeMainAction } from '../board/state'

const checkStateAllowsUse = (state: GameStatePlaying | undefined) => {
  return match(state)
    .with(undefined, () => undefined)
    .with({ mainActionUsed: false }, () => state)
    .with({ mainActionUsed: true }, () => undefined)
    .exhaustive()
}

const removePeatAt =
  (row: number, col: number) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return state
    const player = { ...getPlayer(state) }
    const tile = player.landscape?.[row]?.[col + 2]
    if (tile === undefined) return undefined
    const [land, building] = tile
    if (building !== BuildingEnum.Peat) return undefined
    player.landscape = [
      ...player.landscape.slice(0, row),
      [
        ...player.landscape[row].slice(0, col + 2),
        // the tile in question
        [land] as Tile,
        ...player.landscape[row].slice(col + 2 + 1),
      ],
      ...player.landscape.slice(row + 1),
    ]
    return setPlayerCurried(player)(state)
  }

const givePlayerPeat =
  (useJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const player = getPlayer(state)
    const { joker, peat, pointingBefore } = state.rondel
    const amount = take(pointingBefore, (useJoker ? joker : peat) ?? pointingBefore, state.config)
    return setPlayerCurried({ ...player, peat: player.peat + amount })(state)
  }

const updatePeatRondel =
  (useJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state && {
      ...state,
      rondel: {
        ...state.rondel,
        joker: useJoker ? state.rondel.pointingBefore : state.rondel.joker,
        peat: !useJoker ? state.rondel.pointingBefore : state.rondel.peat,
      },
    }

export const cutPeat = ({ row, col, useJoker }: GameCommandCutPeatParams) =>
  pipe(
    //
    checkStateAllowsUse,
    consumeMainAction,
    givePlayerPeat(useJoker),
    removePeatAt(row, col),
    updatePeatRondel(useJoker)
  )
