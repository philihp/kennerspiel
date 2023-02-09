import { identity, pipe } from 'ramda'
import { GameCommandConfigParams, GameStatePlaying } from '../types'

export const commit = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  return pipe(
    //
    identity
  )(state)
}
