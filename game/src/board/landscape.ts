import { match } from 'ts-pattern'
import { LandEnum, PlayerColor, Tile, BuildingEnum, Clergy, GameCommandConfigParams, ErectionEnum } from '../types'
import { terrainForErection } from './erections'
import { withActivePlayer } from './player'

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

const PP: Tile = [LandEnum.Plains, BuildingEnum.Peat]
const PF: Tile = [LandEnum.Plains, BuildingEnum.Forest]
const P: Tile = [LandEnum.Plains]

const startBuilding = {
  [PlayerColor.Red]: [BuildingEnum.ClayMoundR, BuildingEnum.FarmYardR, BuildingEnum.CloisterOfficeR],
  [PlayerColor.Green]: [BuildingEnum.ClayMoundG, BuildingEnum.FarmYardG, BuildingEnum.CloisterOfficeG],
  [PlayerColor.Blue]: [BuildingEnum.ClayMoundB, BuildingEnum.FarmYardB, BuildingEnum.CloisterOfficeB],
  [PlayerColor.White]: [BuildingEnum.ClayMoundW, BuildingEnum.FarmYardW, BuildingEnum.CloisterOfficeW],
}

export const makeLandscape = (color: PlayerColor): Tile[][] => {
  const cm: Tile = [LandEnum.Hillside, startBuilding[color][0]]
  const fy: Tile = [LandEnum.Plains, startBuilding[color][1]]
  const co: Tile = [LandEnum.Plains, startBuilding[color][2]]
  return [
    [[], [], PP, PF, PF, P, cm, [], []],
    [[], [], PP, PF, fy, P, co, [], []],
  ]
}

export const checkLandTypeMatches = (row: number, col: number, erection: ErectionEnum) =>
  withActivePlayer((player) => {
    const landAtSpot = player.landscape[row + player.landscapeOffset][col + 2][0]
    if (landAtSpot && !terrainForErection(erection).includes(landAtSpot)) return undefined
    return player
  })

export const checkLandscapeFree = (row: number, col: number) => {
  return withActivePlayer((player) => {
    const [, erection] = player.landscape[row + player.landscapeOffset][col + 2]
    if (erection !== undefined) return undefined
    return player
  })
}
