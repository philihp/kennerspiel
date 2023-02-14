import { match } from 'ts-pattern'
import { GameStatePlaying } from '../types'

export const consumeMainAction = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  state && {
    ...state,
    frame: {
      ...state.frame,
      mainActionUsed: true,
    },
  }

export const removeWonder = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return state
  const { wonders } = state
  if (wonders === 0) return undefined
  return {
    ...state,
    wonders: wonders - 1,
  }
}

// export const roundInit = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
//   match(state)
