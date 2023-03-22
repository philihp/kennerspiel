import { StateReducer } from '../../types'

export const checkFinalPhase =
  (next: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const buildings = state.config.length === 'long' ? 3 : 1
    if (state.buildings.length > buildings) return state
    return {
      ...state,
      frame: {
        ...state.frame,
        next,
      },
    }
  }
