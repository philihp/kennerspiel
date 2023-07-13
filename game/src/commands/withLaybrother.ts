import { pipe } from 'ramda'
import { match } from 'ts-pattern'
import { revertActivePlayerToCurrent, setFrameToAllowFreeUsage, withFrame } from '../board/frame'
import { GameCommandEnum, GameStatePlaying, NextUseClergy, StateReducer } from '../types'
import { moveClergyToOwnBuilding } from '../board/clergy'

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

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] =>
    match<string[], string[]>(partial)
      .with([], () => (checkActivePlayerIsNotCurrent(state) ? [GameCommandEnum.WITH_LAYBROTHER] : []))
      .with([GameCommandEnum.WITH_LAYBROTHER], () => [''])
      .otherwise(() => [])
