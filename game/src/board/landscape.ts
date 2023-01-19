import { BuildingEnum, Clergy, Tile } from '../types'

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
