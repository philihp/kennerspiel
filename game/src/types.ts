export enum GameCommandEnum {
  CONFIG = 'CONFIG',
  START = 'START',
  COMMIT = 'COMMIT',
}

export type GameCommandParams = unknown

export type GameCommandConfigParams = GameCommandParams & {
  players: number
}

export enum GameStatusEnum {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export type GameAction =
  | {
      command: GameCommandEnum.CONFIG
      params: GameCommandConfigParams
    }
  | {
      command: GameCommandEnum.START
    }
  | {
      command: GameCommandEnum.COMMIT
    }

export type GameState = {
  seed: number
  status: GameStatusEnum
  actionList: GameAction[]
  activePlayerIndex: number
  numberOfPlayers: number
}

export type GameCommand = (state: GameState, params?: GameCommandParams) => GameState | undefined
