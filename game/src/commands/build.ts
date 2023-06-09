import { pipe, view, filter, always, concat, append, identity } from 'ramda'
import { P, match } from 'ts-pattern'
import { costForBuilding, removeBuildingFromUnbuilt } from '../board/buildings'
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

const payBuildingCost =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state?.frame?.neutralBuildingPhase) return state
    const cost = costForBuilding(building)
    const buyCost = (cost.penny ?? 0) + (cost.nickel ?? 0) * 5
    if (buyCost) {
      return withActivePlayer(subtractCoins(buyCost))(state)
    }
    return withActivePlayer(payCost(cost))(state)
  }

const buildContinuation = (state: GameStatePlaying): GameCommandEnum[] => {
  // solo play settlements are preceeded by a neutral building phase
  if (state.frame.neutralBuildingPhase) {
    // while there are buildings, only allow BUILD
    if (state.buildings.length !== 0) return [GameCommandEnum.BUILD]
    // and when that's finished, allow the player to WORK_CONTRACT or SETTLE.
    return [GameCommandEnum.WORK_CONTRACT, GameCommandEnum.SETTLE]
  }

  // but most of the time, we just want to allow to follow BUILD with an OnlyPrior USE.
  return [GameCommandEnum.USE]
}

export const allowPriorToUse =
  (building: BuildingEnum): StateReducer =>
  (state) =>
    state && {
      ...state,
      frame: {
        ...state.frame,
        bonusActions: concat(buildContinuation(state), state.frame.bonusActions),
        nextUse: NextUseClergy.OnlyPrior,
        usableBuildings: append(building, state.frame.usableBuildings),
      },
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
