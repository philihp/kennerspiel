import { pipe } from 'ramda'
import { nextFrame } from '../board/frame'
import { StateReducer } from '../types'

export const commit: StateReducer = pipe(
  // is this really all we need to do?
  nextFrame
)
