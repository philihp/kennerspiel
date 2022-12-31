import { getPlayer, setPlayer } from '../board/player'
import { GameCommandCutPeatParams, GameStatePlaying, Tile, BuildingEnum, Tableau } from '../types'
import { take } from '../board/wheel'

export const cutPeat = (state: GameStatePlaying, { coords, useJoker }: GameCommandCutPeatParams) => {
  if (state.rondel.joker === undefined) return undefined
  if (state.rondel.peat === undefined) return undefined

  const player: Tableau = { ...(getPlayer(state) as Tableau) }
  const [row, col] = coords

  if (player === undefined) return undefined
  if (player.landscape === undefined) return undefined
  const tile = player.landscape?.[row]?.[col]
  if (tile === undefined) return undefined
  const [land, building] = tile
  if (building !== BuildingEnum.Peat) return undefined

  return {
    ...setPlayer(state, {
      ...player,
      peat:
        player.peat +
        take(state.rondel.pointingBefore, useJoker ? state.rondel.joker : state.rondel.peat, state.config),
      landscape: [
        ...player.landscape.slice(0, row),
        [...player.landscape[row].slice(0, col), [land] as Tile, ...player.landscape[row].slice(col + 1)],
        ...player.landscape.slice(row + 1),
      ],
    }),
    rondel: {
      ...state.rondel,
      joker: useJoker ? state.rondel.pointingBefore : state.rondel.joker,
      peat: !useJoker ? state.rondel.pointingBefore : state.rondel.joker,
    },
  }
}
