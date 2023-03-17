import { setFrameToAllowFreeUsage } from '../board/frame'
import { StateReducer } from '../types'

export const guesthouse = (): StateReducer => (state) => state && setFrameToAllowFreeUsage(state.buildings)(state)
