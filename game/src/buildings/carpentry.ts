import { pipe } from 'ramda'
import { withActivePlayer } from '../board/player'
import { BuildingEnum } from '../types'

const removeForestAt = (row: number, col: number) =>
  withActivePlayer((player) => {
    if (player === undefined) return undefined
    const [land, building] = player.landscape[row][col]
    if (building !== BuildingEnum.Forest) return undefined
    return {
      ...player,
      landscape: [
        ...player.landscape.slice(0, row),
        [...player.landscape[row].slice(0, col), [land], ...player.landscape[row].slice(col + 1)],
        ...player.landscape.slice(row + 1),
      ],
    }
  })

export const carpentry = (row: number, col: number) =>
  pipe(
    //
    removeForestAt(row, col)
  )
