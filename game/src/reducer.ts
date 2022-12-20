import { commit } from './commands/commit'
import { config } from './commands/config'
import { start } from './commands/start'
import { parser } from './parser'
import { GameCommandEnum, GameState, GameStatusEnum, Reducer } from './types'

export const initialState: GameState = {
  randGen: 0n,
  status: GameStatusEnum.SETUP,
  activePlayerIndex: 0,
  actionList: [],
  settling: false,
  extraRound: false,
  plotPurchasePrices: [],
  districtPurchasePrices: [],
}

export const reducer: Reducer = (state, action) => {
  const { command, params } = parser(action)
  switch (command) {
    case GameCommandEnum.CONFIG:
      return config(state, params)
    case GameCommandEnum.START:
      return start(state, params)
    case GameCommandEnum.COMMIT:
      return commit(state)
    default:
      return undefined
  }
}
