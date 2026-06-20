import { PCGState } from 'pcg'
import { GameState, GameStatusEnum } from './types'

export const initialState: GameState = {
  randGen: {} as PCGState,
  status: GameStatusEnum.SETUP,
}
