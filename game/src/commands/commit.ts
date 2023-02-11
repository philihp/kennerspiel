import { pipe } from 'ramda'
import { nextFrame } from '../board/frame'
import { GameStatePlaying } from '../types'

export const commit = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  return pipe(
    //
    nextFrame
  )(state)
}
