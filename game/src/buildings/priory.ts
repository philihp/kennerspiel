import { findClergy } from '../board/landscape'
import { clergyForColor } from '../board/player'
import { BuildingEnum, GameStatePlaying, NextUseClergy } from '../types'

const allowBuildingWithPriorUsable = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  const priors = state.players
    .map(({ color }) => color)
    .map(clergyForColor)
    .map(([, , prior]) => prior)
  const landscapes = state.players.map(({ landscape }) => landscape)
  const clergyLocation = landscapes.map(findClergy(priors))
  const clergyBuildings = clergyLocation.map(([[_r, _c, [_l, building]]]) => building)
  const usableBuildings = clergyBuildings.filter((b) => b !== undefined && b !== BuildingEnum.Priory) as BuildingEnum[]
  return {
    ...state,
    usableBuildings,
    nextUse: NextUseClergy.Free,
  }
}

export const priory = () => allowBuildingWithPriorUsable
