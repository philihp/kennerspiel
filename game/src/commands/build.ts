import { pipe } from 'ramda'
import { costForBuilding, isCloisterBuilding, terrainForBuilding } from '../board/buildings'
import { getPlayer, setPlayer, withActivePlayer } from '../board/player'
import { canAfford } from '../board/resource'
import { consumeMainAction } from '../board/state'
import { BuildingEnum, GameCommandBuildParams, GameStatePlaying, NextUseClergy, Tableau, Tile } from '../types'

const checkMainActionNotUsed = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.mainActionUsed) return undefined
  return state
}

const checkBuildingUnbuilt =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
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

const checkPlayerHasBuildingCost =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    return state && canAfford(costForBuilding(building))(getPlayer(state)) ? state : undefined
  }

const checkBuildingCloister = (row: number, col: number, building: BuildingEnum) => {
  if (isCloisterBuilding(building) === false) return (state: GameStatePlaying | undefined) => state
  return withActivePlayer((player) => {
    const { landscape, landscapeOffset } = player
    if (isCloisterBuilding(landscape[row + landscapeOffset + 1]?.[col + 2]?.[1])) return player
    if (isCloisterBuilding(landscape[row + landscapeOffset - 1]?.[col + 2]?.[1])) return player
    if (isCloisterBuilding(landscape[row + landscapeOffset]?.[col + 3]?.[1])) return player
    if (isCloisterBuilding(landscape[row + landscapeOffset]?.[col + 1]?.[1])) return player
    return undefined
  })
}

const removeBuildingFromUnbuilt =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state && {
      ...state,
      buildings: state?.buildings.filter((b) => b !== building),
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

const removeBuildingCost =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const player = Object.entries(costForBuilding(building)).reduce(
      (p: Tableau, [type, amountNeeded]) => ({
        ...p,
        // ugh typescript, don't make it weird.
        [type]: (p[type as keyof Tableau] as number) - amountNeeded,
      }),
      getPlayer(state)
    )
    return setPlayer(state, player)
  }

export const allowPriorToUse =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    return (
      state && {
        ...state,
        nextUse: NextUseClergy.OnlyPrior,
        usableBuildings: [building],
      }
    )
  }

export const build = ({ row, col, building }: GameCommandBuildParams) =>
  pipe(
    checkMainActionNotUsed,
    consumeMainAction,
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
