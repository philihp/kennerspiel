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

// export const roundInit = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
//   match(state)
