import { any, pipe, filter } from 'ramda'
import { costForBuilding, isCloisterBuilding, terrainForBuilding } from '../board/buildings'
import { oncePerFrame } from '../board/frame'
import { payCost, withActivePlayer } from '../board/player'
import { canAfford } from '../board/resource'
import {
  BuildingEnum,
  GameCommandBuildParams,
  GameCommandEnum,
  GameStatePlaying,
  NextUseClergy,
  StateReducer,
  Tile,
} from '../types'

const checkBuildingUnbuilt =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    return state?.buildings.includes(building) ? state : undefined
  }

const checkLandscapeFree = (row: number, col: number) => {
  return withActivePlayer((player) => {
    const [, erection] = player.landscape[row + player.landscapeOffset][col + 2]
    if (erection !== undefined) return undefined
    return player
  })
}

const checkLandTypeMatches = (row: number, col: number, building: BuildingEnum) =>
  withActivePlayer((player) => {
    const landAtSpot = player.landscape[row + player.landscapeOffset][col + 2][0]
    if (landAtSpot && !terrainForBuilding(building).includes(landAtSpot)) return undefined
    return player
  })

const checkPlayerHasBuildingCost = (building: BuildingEnum) => withActivePlayer(canAfford(costForBuilding(building)))

const checkBuildingCloister = (row: number, col: number, building: BuildingEnum) => {
  if (isCloisterBuilding(building) === false) return (state: GameStatePlaying | undefined) => state
  return withActivePlayer((player) => {
    const { landscape, landscapeOffset } = player
    return any(isCloisterBuilding, [
      landscape[row + landscapeOffset + 1]?.[col + 2]?.[1],
      landscape[row + landscapeOffset - 1]?.[col + 2]?.[1],
      landscape[row + landscapeOffset]?.[col + 3]?.[1],
      landscape[row + landscapeOffset]?.[col + 1]?.[1],
    ])
      ? player
      : undefined
  })
}

const removeBuildingFromUnbuilt =
  (building: BuildingEnum): StateReducer =>
  (state) =>
    state && {
      ...state,
      buildings: filter((b) => b !== building, state?.buildings),
    }

const addBuildingAtLandscape = (row: number, col: number, building: BuildingEnum) =>
  withActivePlayer((player) => {
    const rowOff = row + player.landscapeOffset
    const landscape = [
      ...player.landscape.slice(0, rowOff),
      [
        ...player.landscape[rowOff].slice(0, col + 2),
        [player.landscape[rowOff][col + 2][0], building] as Tile,
        ...player.landscape[rowOff].slice(col + 2 + 1),
      ],
      ...player.landscape.slice(rowOff + 1),
    ]
    return {
      ...player,
      landscape,
    }
  })

const removeBuildingCost = (building: BuildingEnum) => withActivePlayer(payCost(costForBuilding(building)))

export const allowPriorToUse =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    return (
      state && {
        ...state,
        frame: {
          ...state.frame,
          nextUse: NextUseClergy.OnlyPrior,
          usableBuildings: [building],
        },
      }
    )
  }

export const build = ({ row, col, building }: GameCommandBuildParams) =>
  pipe(
    oncePerFrame(GameCommandEnum.BUILD),
    checkBuildingUnbuilt(building),
    checkLandscapeFree(row, col),
    checkLandTypeMatches(row, col, building),
    checkPlayerHasBuildingCost(building),
    checkBuildingCloister(row, col, building),
    removeBuildingFromUnbuilt(building),
    addBuildingAtLandscape(row, col, building),
    removeBuildingCost(building),
    allowPriorToUse(building)
  )
