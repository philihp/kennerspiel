import { always, curry, pipe } from 'ramda'
import { match } from 'ts-pattern'
import { nextFrame } from '../board/frame'
import { GameCommandEnum, GameStatePlaying, StateReducer } from '../types'

export const commit: StateReducer = pipe(
  // is this really all we need to do?
  nextFrame
)

export const complete = curry((state: GameStatePlaying, partial: string[]): string[] => {
  return match<string[], string[]>(partial)
    .with([], () => {
      if (state.frame.mainActionUsed) return [GameCommandEnum.COMMIT]
      return []
    })
    .with([GameCommandEnum.COMMIT], () => [''])
    .otherwise(always([]))
})
