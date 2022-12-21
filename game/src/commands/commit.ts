import { mode } from '../board/mode'
import { GameCommand, GameState, GameStatusEnum } from '../types'

export const commit: GameCommand = (state: GameState) => {
  if (state === undefined) return undefined
  if (state.status !== GameStatusEnum.PLAYING) return undefined
  if (state?.rondel?.pointingBefore === undefined) return undefined
  if (state.config?.players === undefined) return undefined
  if (state.players === undefined) return undefined
  if (state.moveInRound === undefined) return undefined

  const { preMove, postMove } = mode(state.config)

  const newState = postMove(state)
  if (newState === undefined) return undefined

  // premove
  return preMove(newState)
}
