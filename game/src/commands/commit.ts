import { postMove } from '../board/postMove'
import { preMove } from '../board/preMove'
import { GameStatePlaying } from '../types'

export const commit = (state: GameStatePlaying) => {
  const newState = postMove(state.config)(state)
  if (newState === undefined) return undefined

  // premove
  return preMove(newState)
}
