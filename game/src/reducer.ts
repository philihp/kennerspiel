import { commit } from './commands/commit'
import { config } from './commands/config'
import { cutPeat } from './commands/cutPeat'
import { start } from './commands/start'
import { parser } from './parser'
import { GameCommandEnum, GameState, GameStatusEnum, Reducer, SettlementRound } from './types'

export const initialState: GameState = {
  randGen: 0n,
  status: GameStatusEnum.SETUP,
  activePlayerIndex: 0,
  actionList: [],
  settling: false,
  extraRound: false,
  settlementRound: SettlementRound.S,
  plotPurchasePrices: [],
  districtPurchasePrices: [],
  buildings: [],
}

export const reducer: Reducer = (state, action) => {
  const parsed = parser(action)
  switch (parsed?.command) {
    case GameCommandEnum.CONFIG:
      return config(state, parsed.params)
    case GameCommandEnum.START:
      return start(state, parsed.params)
    case GameCommandEnum.COMMIT:
      return commit(state)
    case GameCommandEnum.CUT_PEAT:
      return cutPeat(state, parsed.params)
    default:
      return undefined
  }
}
