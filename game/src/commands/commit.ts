import { always, pipe } from 'ramda'
import { match } from 'ts-pattern'
import { nextFrame } from '../board/frame'
import { GameCommandEnum, GameStatePlaying, StateReducer } from '../types'

const checkCanCommit: StateReducer = (state) => {
  if (state === undefined) return state
  if (state.frame.currentPlayerIndex !== state.frame.activePlayerIndex) return undefined
  if (state.frame.neutralBuildingPhase) {
    if (state.buildings.length !== 0) return undefined
    return state
  }
  if (state.frame.mainActionUsed) return state
  return undefined
}

export const commit: StateReducer = pipe(
  //
  checkCanCommit,
  nextFrame
)

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] => {
    return match<string[], string[]>(partial)
      .with([], () => {
        if (checkCanCommit(state) === undefined) return []
        return [GameCommandEnum.COMMIT]
      })
      .with([GameCommandEnum.COMMIT], () => [''])
      .otherwise(always([]))
  }
