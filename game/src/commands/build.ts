import { pipe, view, filter, always, concat, append, set, lensPath, intersection, lensProp } from 'ramda'
import { P, match } from 'ts-pattern'
import { costForBuilding, removeBuildingFromUnbuilt } from '../board/buildings'
import { addErectionAtLandscape } from '../board/erections'
import { oncePerFrame } from '../board/frame'
import {
  allVacantUsableBuildings,
  checkCloisterAdjacency,
  checkLandscapeFree,
  checkLandTypeMatches,
  erectableLocations,
  erectableLocationsCol,
} from '../board/landscape'
import { activeLens, payCost, subtractCoins, withActivePlayer } from '../board/player'
import {
  BuildingEnum,
  Frame,
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
    // and when that's finished, allow the player to SETTLE or COMMIT. USE will also be available because of buildings built
    return [GameCommandEnum.SETTLE, GameCommandEnum.COMMIT]
  }

  // but most of the time, we just want to allow to follow BUILD with an OnlyPrior USE.
  return [GameCommandEnum.USE]
}

export const allowPriorToUse =
  (building: BuildingEnum): StateReducer =>
  (state) =>
    state &&
    set<GameStatePlaying, Frame>(
      lensProp('frame'),
      pipe(
        set(lensPath(['bonusActions']), concat(buildContinuation(state), state.frame.bonusActions)),
        set(lensPath(['nextUse']), NextUseClergy.OnlyPrior),
        set(
          lensPath(['usableBuildings']),
          append(
            building,
            intersection(
              state.frame.neutralBuildingPhase ? allVacantUsableBuildings(state.players[1].landscape) : [],
              state.frame.usableBuildings
            )
          )
        )
      )(state.frame)
    )(state)

export const build = ({ row, col, building }: GameCommandBuildParams): StateReducer =>
  pipe(
    // any of these not defined here are probably shared with SETTLE
    oncePerFrame(GameCommandEnum.BUILD),
    checkLandscapeFree(row, col, building),
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
            filter(
              (building: BuildingEnum): boolean =>
                state.frame.neutralBuildingPhase || !!payCost(costForBuilding(building))(player),
              state.buildings
            )
          )
        )
        .with([GameCommandEnum.BUILD, P._], ([, building]) =>
          state.frame.neutralBuildingPhase
            ? // TODO: when building a cloister, only suggest empty or cloister spots
              // TODO: when building a non-cloister, only suggest non-cloister spots

              // in a neutral building phase, we can build on netural heartland on top of anything
              ['0 0', '1 0', '2 0', '3 0', '4 0', '0 1', '1 1', '2 1', '3 1', '4 1']
            : // all the coords which match the terrain for this building...
              erectableLocations(building as BuildingEnum, player)
        )
        .with([GameCommandEnum.BUILD, P._, P._], ([, building, col]) =>
          state.frame.neutralBuildingPhase
            ? // in a neutral building phase, we can build on netural heartland on top of anything
              ['0', '1']
            : // all the coords which match the terrain from the previous step, and have
              // the same prefix as the column
              erectableLocationsCol(building as BuildingEnum, col, player)
        )
        // TODO: only show '' if the command is ultimately valid
        .with([GameCommandEnum.BUILD, P._, P._, P._], always(['']))
        .otherwise(always([]))
    )
  }
