import { any, pipe, identity } from 'ramda'
import { costForBuilding, isCloisterBuilding, removeBuildingFromUnbuilt } from '../board/buildings'
import { addErectionAtLandscape } from '../board/erections'
import { oncePerFrame } from '../board/frame'
import { checkLandscapeFree, checkLandTypeMatches } from '../board/landscape'
import { payCost, subtractCoins, withActivePlayer } from '../board/player'
import { BuildingEnum, GameCommandBuildParams, GameCommandEnum, NextUseClergy, StateReducer } from '../types'

const checkCloisterAdjacency = (row: number, col: number, building: BuildingEnum) => {
  if (isCloisterBuilding(building) === false) return identity
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

const payBuildingCost = (building: BuildingEnum) => {
  const cost = costForBuilding(building)
  const buyCost = (cost.penny ?? 0) + (cost.nickel ?? 0) * 5
  if (buyCost) {
    return withActivePlayer(subtractCoins(buyCost))
  }
  return withActivePlayer(payCost(cost))
}

export const allowPriorToUse =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    return (
      state && {
        ...state,
        frame: {
          ...state.frame,
          bonusActions: [GameCommandEnum.USE, ...state.frame.bonusActions],
          nextUse: NextUseClergy.OnlyPrior,
          usableBuildings: [building],
        },
      }
    )
  }

export const build = ({ row, col, building }: GameCommandBuildParams) =>
  pipe(
    // any of these not defined here are probably shared with SETTLE
    oncePerFrame(GameCommandEnum.BUILD),
    checkLandscapeFree(row, col),
    checkLandTypeMatches(row, col, building),
    checkCloisterAdjacency(row, col, building),
    payBuildingCost(building),
    removeBuildingFromUnbuilt(building),
    addErectionAtLandscape(row, col, building),
    allowPriorToUse(building)
  )
