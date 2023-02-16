import { pipe } from 'ramda'
import { StateReducer, NextUseClergy } from '../types'

const allowUseAnyUnbuiltBuilding: StateReducer = (state) => {
  if (state === undefined) return undefined
  return {
    ...state,
    frame: {
      ...state.frame,
      usableBuildings: state.buildings,
      nextUse: NextUseClergy.Free,
    },
  }
}

export const hospice = () =>
  pipe(
    //
    allowUseAnyUnbuiltBuilding
  )
