import { commit } from './commands/commit'
import { config } from './commands/config'
import { start } from './commands/start'
import { GameAction, GameCommandEnum, GameState, GameStatusEnum } from './types'

export const initialState: GameState = {
  seed: 0,
  status: GameStatusEnum.SETUP,
  numberOfPlayers: 0,
  activePlayerIndex: 0,
  actionList: [],
}
export const reducer = (state: GameState, action: GameAction) => {
  switch (action.command) {
    case GameCommandEnum.CONFIG:
      return config(state, action.params)
    case GameCommandEnum.START:
      return start(state)
    case GameCommandEnum.COMMIT:
      return commit(state)
    default:
      return undefined
  }
}
