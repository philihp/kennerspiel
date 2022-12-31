import { commit } from './commands/commit'
import { config } from './commands/config'
import { cutPeat } from './commands/cutPeat'
import { start } from './commands/start'
import { parser } from './parser'
import { GameCommandEnum, GameStatePlaying, GameStateSetup, GameStatusEnum, Reducer } from './types'

export const initialState: GameStateSetup = {
  randGen: 0n,
  status: GameStatusEnum.SETUP,
}

export const reducer: Reducer = (state, action) => {
  const parsed = parser(action)
  switch (parsed?.command) {
    case GameCommandEnum.CONFIG:
      return config(state as GameStateSetup, parsed.params)
    case GameCommandEnum.START:
      return start(state as GameStateSetup, parsed.params)
    case GameCommandEnum.COMMIT:
      return commit(state as GameStatePlaying)
    case GameCommandEnum.CUT_PEAT:
      return cutPeat(state as GameStatePlaying, parsed.params)
    default:
      return undefined
  }
}
