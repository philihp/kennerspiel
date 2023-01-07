import { pipe } from 'ramda'
import { costForBuilding, isCloisterBuilding, terrainForBuilding } from '../board/buildings'
import { getPlayer } from '../board/player'
import { BuildingEnum, GameCommandBuildParams, GameStatePlaying, Tableau } from '../types'

const checkBuildingUnbuilt =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state?.buildings.includes(building) ? state : undefined

const checkLandscapeFree =
  (row: number, col: number) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state && !state.players[state.activePlayerIndex].landscape[row][col][1] ? state : undefined

const checkLandTypeMatches =
  (row: number, col: number, building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state && terrainForBuilding(building).includes(state.players[state.activePlayerIndex].landscape[row][col][0])
      ? state
      : undefined

const checkPlayerHasBuildingCost =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state &&
    Object.entries(costForBuilding(building)).every(
      ([type, amountNeeded]) => getPlayer(state)[type as keyof Tableau] >= amountNeeded
    )
      ? state
      : undefined

const checkBuildingCloister =
  (row: number, col: number, building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state &&
    (!isCloisterBuilding(building) ||
      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ].some(([rowMod, colMod]) => isCloisterBuilding(getPlayer(state).landscape[row + rowMod]?.[col + colMod]?.[1])))
      ? state
      : undefined

export const build = ({ row, col, building }: GameCommandBuildParams) =>
  pipe(
    checkBuildingUnbuilt(building),
    checkLandscapeFree(row, col),
    checkLandTypeMatches(row, col, building),
    checkPlayerHasBuildingCost(building),
    checkBuildingCloister(row, col, building)
    // removeBuildingFromUnbuilt,
    // addBuildingAtLandscape,
    // removePlayerResources
  )

// TODO:  check land type matches
// TODO: check player has building cost
// TODO: if this building is a cloister, make sure its next to another

// === all good

// TODO: remove building from unbuilt
// TODO: add building at landscape
// TODO: remove player resources
