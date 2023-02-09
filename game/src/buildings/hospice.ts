import { pipe } from 'ramda'
import { GameStatePlaying, NextUseClergy } from '../types'

const allowUseAnyUnbuiltBuilding = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
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
