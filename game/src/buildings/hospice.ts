import { setFrameToAllowFreeUsage } from '../board/frame'
import { StateReducer } from '../types'

export const hospice = (): StateReducer => (state) => state && setFrameToAllowFreeUsage(state.buildings)(state)
