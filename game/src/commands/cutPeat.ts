import { getPlayer, setPlayer } from '../board/player'
import { GameCommandCutPeatParams, GameStatePlaying, Tile, BuildingEnum, Tableau } from '../types'
import { take } from '../board/wheel'

export const cutPeat = (state: GameStatePlaying, { row, col, useJoker }: GameCommandCutPeatParams) => {
  const player: Tableau = { ...(getPlayer(state) as Tableau) }

  if (player === undefined) return undefined
  if (player.landscape === undefined) return undefined
  const tile = player.landscape?.[row]?.[col]
  if (tile === undefined) return undefined
  const [land, building] = tile
  if (building !== BuildingEnum.Peat) return undefined

  const { joker, peat, pointingBefore } = state.rondel

  return {
    ...setPlayer(state, {
      ...player,
      peat: player.peat + take(pointingBefore, (useJoker ? joker : peat) ?? pointingBefore, state.config),
      landscape: [
        ...player.landscape.slice(0, row),
        [...player.landscape[row].slice(0, col), [land] as Tile, ...player.landscape[row].slice(col + 1)],
        ...player.landscape.slice(row + 1),
      ],
    }),
    rondel: {
      ...state.rondel,
      joker: useJoker ? pointingBefore : joker,
      peat: !useJoker ? pointingBefore : joker,
    },
  }
}
