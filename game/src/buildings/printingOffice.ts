import { map, pipe, reduce, splitEvery, take } from 'ramda'
import { getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, Tableau, Tile } from '../types'

const removeForestAt = (player: Tableau | undefined, [col, row]: [number, number]): Tableau | undefined => {
  if (player === undefined) return undefined
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
}

export const printingOffice = (...coords: string[]) => {
  if (coords.length % 2 === 1) return () => undefined
  const pairs = take(4)(splitEvery(2)(map((n) => Number.parseInt(n, 10), coords))) as [number, number][]
  return withActivePlayer(
    pipe(
      //
      (state) => reduce(removeForestAt, state, pairs),
      getCost({ book: pairs.length })
    )
  )
}
