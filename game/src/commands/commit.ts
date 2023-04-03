import { curry, pipe } from 'ramda'
import { nextFrame } from '../board/frame'
import { GameStatePlaying, StateReducer } from '../types'

export const commit: StateReducer = pipe(
  // is this really all we need to do?
  nextFrame
)

export const complete = curry((state: GameStatePlaying, partial: string[]): string[] => {
  return []
})
