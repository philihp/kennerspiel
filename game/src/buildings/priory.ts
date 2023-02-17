import { findClergy } from '../board/landscape'
import { priors } from '../board/player'
import { BuildingEnum, NextUseClergy, StateReducer } from '../types'

const allowBuildingWithPriorUsable: StateReducer = (state) => {
  if (state === undefined) return undefined
  const landscapes = state.players.map(({ landscape }) => landscape)
  const clergyLocation = landscapes.map(findClergy(priors(state))).filter((l) => l.length > 0)
  const clergyBuildings = clergyLocation.map(([[_r, _c, [_l, building]]]) => building)
  const usableBuildings = clergyBuildings.filter((b) => b !== BuildingEnum.Priory) as BuildingEnum[]
  return {
    ...state,
    frame: {
      ...state.frame,
      usableBuildings,
      nextUse: NextUseClergy.Free,
    },
  }
}

export const priory = () => allowBuildingWithPriorUsable
