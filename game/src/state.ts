import { PCGState } from 'fn-pcg/dist/types'
import { GameStateSetup, GameStatusEnum } from './types'

export const initialState: GameStateSetup = {
  randGen: {} as PCGState,
  status: GameStatusEnum.SETUP,
}
