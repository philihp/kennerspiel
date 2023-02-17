import { pipe } from 'ramda'
import { revertActivePlayerToCurrent, setFrameToAllowFreeUsage, withFrame } from '../board/frame'
import { moveClergyToOwnBuilding } from '../board/landscape'
import { NextUseClergy, StateReducer } from '../types'

const withAnyForCurrentPlayer: StateReducer = withFrame((frame) => ({
  ...frame,
  nextUse: NextUseClergy.Any,
}))

const checkActivePlayerIsNotCurrent: StateReducer = withFrame((frame) => {
  if (frame.activePlayerIndex === frame.currentPlayerIndex) return undefined
  return frame
})

const checkHasExactlyOneUsableBuilding: StateReducer = withFrame((frame) => {
  if (frame.usableBuildings.length !== 1) return undefined
  return frame
})

export const withLaybrother: StateReducer = (state) => {
  if (state === undefined) return undefined
  if (state.frame.usableBuildings.length !== 1) return undefined
  return pipe(
    //
    checkActivePlayerIsNotCurrent,
    checkHasExactlyOneUsableBuilding,
    withAnyForCurrentPlayer,
    moveClergyToOwnBuilding(state.frame.usableBuildings[0]),
    setFrameToAllowFreeUsage([state.frame.usableBuildings[0]]),
    revertActivePlayerToCurrent
  )(state)
}
