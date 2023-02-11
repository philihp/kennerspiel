import { identity, pipe } from 'ramda'
import { nextFrame } from '../board/frame'
import { GameCommandConfigParams, GameStatePlaying } from '../types'

export const commit = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  return pipe(
    //
    (state) => {
      return nextFrame(state)
    }
  )(state)
}
