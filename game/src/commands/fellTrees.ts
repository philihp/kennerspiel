import { getPlayer, setPlayer } from '../board/player'
import { GameCommandFellTreesParams, GameStatePlaying, Tile, BuildingEnum, Tableau } from '../types'
import { take } from '../board/wheel'

export const fellTrees =
  ({ row, col, useJoker }: GameCommandFellTreesParams) =>
  (state: GameStatePlaying): GameStatePlaying | undefined => {
    const player: Tableau = { ...(getPlayer(state) as Tableau) }

    if (player === undefined) return undefined
    if (player.landscape === undefined) return undefined
    const tile = player.landscape?.[row]?.[col]
    if (tile === undefined) return undefined
    const [land, building] = tile
    if (building !== BuildingEnum.Forest) return undefined

    const { joker, wood, pointingBefore } = state.rondel

    return {
      ...setPlayer(state, {
        ...player,
        wood: player.wood + take(pointingBefore, (useJoker ? joker : wood) ?? pointingBefore, state.config),
        landscape: [
          ...player.landscape.slice(0, row),
          [...player.landscape[row].slice(0, col), [land] as Tile, ...player.landscape[row].slice(col + 1)],
          ...player.landscape.slice(row + 1),
        ],
      }),
      rondel: {
        ...state.rondel,
        joker: useJoker ? pointingBefore : joker,
        wood: !useJoker ? pointingBefore : joker,
      },
    }
  }
