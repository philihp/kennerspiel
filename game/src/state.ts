import { GameStateSetup, GameStatusEnum } from './types'

export const initialState: GameStateSetup = {
  randGen: 0n,
  status: GameStatusEnum.SETUP,
}
