import { GameStatusEnum, StateReducer } from '../types'

export const consumeMainAction: StateReducer = (state) =>
  state && {
    ...state,
    frame: {
      ...state.frame,
      mainActionUsed: true,
    },
  }

export const removeWonder: StateReducer = (state) => {
  if (state === undefined) return state
  const { wonders } = state
  if (wonders === 0) return undefined
  return {
    ...state,
    wonders: wonders - 1,
  }
}

export const gameEnd: StateReducer = (state) => {
  if (state === undefined) return state
  return {
    ...state,
    status: GameStatusEnum.FINISHED,
  }
}
