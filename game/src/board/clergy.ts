import { filter, find, lensPath, pipe, set } from 'ramda'
import { match } from 'ts-pattern'
import { BuildingEnum, Clergy, GameStatePlaying, NextUseClergy, StateReducer, Tableau, Tile } from '../types'
import { findBuildingWithoutOffset } from './landscape'
import { isPrior, withActivePlayer } from './player'
import { setFrameToAllowFreeUsage } from './frame'

export const moveClergyToOwnBuilding =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (state.frame.nextUse === NextUseClergy.Free) return state
    const player = state.players[state.frame.activePlayerIndex]
    const matrixLocation = findBuildingWithoutOffset(building)(player.landscape)
    if (matrixLocation === undefined) return undefined
    const [row, col] = matrixLocation
    const [land, ,] = player.landscape[row][col]

    const priors = player.clergy.filter(isPrior)
    if (state.frame.nextUse === NextUseClergy.OnlyPrior && priors.length === 0) return undefined
    // ^this line unnecessary
    const nextClergy = match(state.frame.nextUse)
      .with(NextUseClergy.Any, () => player.clergy[0])
      .with(NextUseClergy.OnlyPrior, () => priors[0])
      .exhaustive()

    if (nextClergy === undefined) return undefined

    return withActivePlayer(
      pipe(
        //
        set<Tableau, Tile>(lensPath(['landscape', row, col]), [land, building, nextClergy]),
        set<Tableau, Clergy[]>(lensPath(['clergy']), filter((c) => c !== nextClergy)(player.clergy))
      )
    )(state)
  }

export const moveClergyToNeutralBuilding =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const neutralPlayer = state.players[1]
    const matrixLocation = findBuildingWithoutOffset(building)(neutralPlayer.landscape)
    if (matrixLocation === undefined) return undefined
    const [row, col] = matrixLocation
    const [land, ,] = neutralPlayer.landscape[row][col]
    const nextClergy =
      state.frame.nextUse === NextUseClergy.OnlyPrior ? find(isPrior, neutralPlayer.clergy) : neutralPlayer.clergy[0]
    if (nextClergy === undefined) return undefined

    return pipe(
      set<GameStatePlaying, Tile>(lensPath(['players', 1, 'landscape', row, col]), [land, building, nextClergy]),
      set<GameStatePlaying, Clergy[]>(
        lensPath(['players', 1, 'clergy']),
        filter((c) => c !== nextClergy)(neutralPlayer.clergy)
      ),
      setFrameToAllowFreeUsage([building])
    )(state)
  }
