import { setFrameToAllowFreeUsage } from '../board/frame'
import { findClergy } from '../board/landscape'
import { priors } from '../board/player'
import { BuildingEnum, StateReducer } from '../types'

export const priory = (): StateReducer => (state) => {
  if (state === undefined) return undefined
  const landscapes = state.players.map(({ landscape }) => landscape)
  const clergyLocation = landscapes.map(findClergy(priors(state))).filter((l) => l.length > 0)
  const clergyBuildings = clergyLocation.map(([[_r, _c, [_l, building]]]) => building)
  const usableBuildings = clergyBuildings.filter((b) => b !== BuildingEnum.Priory) as BuildingEnum[]
  return setFrameToAllowFreeUsage(usableBuildings)(state)
}
