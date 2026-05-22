import { PCGState } from 'pcg'
import { GameStateSetup, GameStatusEnum } from './types'

export const initialState: GameStateSetup = {
  randGen: {} as PCGState,
  status: GameStatusEnum.SETUP,
}
