import { match } from 'ts-pattern'
import { BuildingEnum, Clergy, GameCommandConfigParams, Tile } from '../types'

export const districtPrices = (config: GameCommandConfigParams): number[] =>
  match(config)
    .with({ players: 1 }, () => [8, 7, 6, 5, 5, 4, 4, 3, 2])
    .otherwise(() => [2, 3, 4, 4, 5, 5, 6, 7, 8])

export const plotPrices = (config: GameCommandConfigParams): number[] =>
  match(config)
    .with({ players: 1 }, () => [7, 6, 6, 5, 5, 5, 4, 4, 3])
    .otherwise(() => [3, 4, 4, 5, 5, 5, 6, 6, 7])

export const findBuilding =
  (building: BuildingEnum) =>
  (landscape: Tile[][]): [number, number] | undefined => {
    let row
    let col
    landscape.forEach((landRow, r) => {
      landRow.forEach(([_l, b, _c], c) => {
        if (building === b) {
          row = r
          col = c
        }
      })
    })
    if (row === undefined || col === undefined) return undefined
    return [row, col]
  }

export const findClergy =
  (clergy: Clergy[]) =>
  (landscape: Tile[][]): [number, number, Tile][] => {
    const locationsFound: [number, number, Tile][] = []
    landscape.forEach((landRow, r) => {
      landRow.forEach((land, c) => {
        const [_l, _b, clergyHere] = land
        if (clergyHere && clergy.includes(clergyHere)) {
          locationsFound.push([r, c, land])
        }
      })
    })
    return locationsFound
  }
