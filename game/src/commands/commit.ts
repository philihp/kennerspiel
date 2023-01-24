import { pipe } from 'ramda'
import { postMove } from '../board/postMove'
import { preMove } from '../board/preMove'
import { GameCommandConfigParams, GameStatePlaying } from '../types'

const runPostMove = (config?: GameCommandConfigParams) => {
  if (config === undefined) return () => undefined
  return postMove(config)
}

export const commit = (state: GameStatePlaying) => {
  return pipe(
    //
    runPostMove(state.config),
    preMove
  )(state)
}
