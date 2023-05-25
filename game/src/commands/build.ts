import { any, pipe, identity, curry, view, filter, always } from 'ramda'
import { P, match } from 'ts-pattern'
import { costForBuilding, isCloisterBuilding, removeBuildingFromUnbuilt } from '../board/buildings'
import { addErectionAtLandscape } from '../board/erections'
import { oncePerFrame } from '../board/frame'
import {
  checkCloisterAdjacency,
  checkLandscapeFree,
  checkLandTypeMatches,
  erectableLocations,
  erectableLocationsCol,
} from '../board/landscape'
import { activeLens, payCost, subtractCoins, withActivePlayer } from '../board/player'
import {
  BuildingEnum,
  GameCommandBuildParams,
  GameCommandEnum,
  GameStatePlaying,
  NextUseClergy,
  StateReducer,
} from '../types'

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

export const build = ({ row, col, building }: GameCommandBuildParams): StateReducer =>
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

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] => {
    const player = view(activeLens(state), state)
    return (
      match<string[], string[]>(partial)
        .with([], () => {
          if (oncePerFrame(GameCommandEnum.BUILD)(state)) return [GameCommandEnum.BUILD]
          return []
        })
        .with(
          [GameCommandEnum.BUILD],
          // return all buildings we have the resources for
          always(
            filter((building: BuildingEnum): boolean => !!payCost(costForBuilding(building))(player), state.buildings)
          )
        )
        .with([GameCommandEnum.BUILD, P._], ([, building]) =>
          // Return all the coords which match the terrain for this building...
          erectableLocations(building as BuildingEnum, player)
        )
        .with([GameCommandEnum.BUILD, P._, P._], ([, building, col]) =>
          // Return all the coords which match the terrain from the previous step, and have
          // the same prefix as the column
          erectableLocationsCol(building as BuildingEnum, col, player)
        )
        // TODO: only show '' if the command is ultimately valid
        .with([GameCommandEnum.BUILD, P._, P._, P._], always(['']))
        .otherwise(always([]))
    )
  }
