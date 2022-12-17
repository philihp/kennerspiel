export enum GameCommandEnum {
  CONFIG = 'CONFIG',
  START = 'START',
  COMMIT = 'COMMIT',
}

export type GameConfigPlayers = 1 | 2 | 3 | 4
export type GameConfigLength = 'short' | 'long'
export type GameConfigCountry = 'ireland' | 'france'

export type GameCommandConfigParams = {
  players?: GameConfigPlayers
  length?: GameConfigLength
  country?: GameConfigCountry
}

export enum GameStatusEnum {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export type GameUnparsedAction = string[]

export type GameActionCommit = { command: GameCommandEnum.COMMIT; params: undefined }
export type GameActionConfig = { command: GameCommandEnum.CONFIG; params: GameCommandConfigParams }
export type GameActionStart = { command: GameCommandEnum.START; params: undefined }
export type GameActionUndefined = { command: undefined; params: undefined }
export type GameAction = GameActionCommit | GameActionConfig | GameActionStart | GameActionUndefined

export type GameState = {
  seed: number
  status: GameStatusEnum
  actionList: GameAction[]
  activePlayerIndex: number
  config?: GameCommandConfigParams
  rondel?: {
    pointingBefore: number
    wood?: number
    clay?: number
    coin?: number
    joker?: number
  }
}

export type GameCommand = (state: GameState, params?: unknown) => GameState | undefined

export type Reducer = (state: GameState, action: string[]) => GameState | undefined

export type Parser = (action: GameUnparsedAction) => GameAction
