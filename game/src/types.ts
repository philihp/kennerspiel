import { PCGState } from 'fn-pcg'

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

export enum PlayerColor {
  Red = 'R',
  Green = 'G',
  Blue = 'B',
  White = 'W',
}

export type GameCommandStartParams = {
  seed: number
  colors: PlayerColor[]
}

export enum GameStatusEnum {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export enum LandEnum {
  Hillside = 'H',
  Plains = 'P',
  Coast = 'C',
  Water = 'W',
  Mountain = 'M',
}

export enum ResourceEnum {
  Wood = 'Wo',
  Whiskey = 'Wh',
  Grain = 'Gn',
  Straw = 'Sw',
  Meat = 'Mt',
  Clay = 'Cl',
  Pottery = 'Po',
  Peat = 'Pt',
  Coal = 'Co',
  Penny = 'Pn',
  Book = 'Bo',
  Stone = 'Sn',
  Ornament = 'Or',
  Flour = 'Fl',
  Bread = 'Br',
  Grape = 'Gp',
  Wine = 'Wn',
  Nickel = 'Ni',
  Reliquary = 'Rq',
  Hops = 'Ho',
  Beear = 'Be',
  BonusPoint = 'Bp',
  Joker = 'Jo', // Use the Joker
}

export enum BuildingEnum {
  Peat = 'LPE',
  Forest = 'LFO',
  ClayMoundR = 'LR1',
  ClayMoundG = 'LG1',
  ClayMoundB = 'LB1',
  ClayMoundW = 'LW1',
  FarmYardR = 'LR2',
  FarmYardG = 'LG2',
  FarmYardB = 'LB2',
  FarmYardW = 'LW2',
  CloisterOfficeR = 'LR3',
  CloisterOfficeG = 'LG3',
  CloisterOfficeB = 'LB3',
  CloisterOfficeW = 'LW3',
}

export enum Clergy {
  laybrother1 = 'LayBrother1',
  laybrother2 = 'LayBrother2',
  prior = 'Prior',
}

export type Tile = [LandEnum, BuildingEnum?]

export type Tableau = {
  clergy: Clergy[]
  landscape: Tile[][]
  peat: number
  penny: number
  clay: number
  wood: number
  grain: number
  sheep: number
  stone: number
  flour: number
  grapes: number
  nickel: number
  hops: number
  coal: number
  book: number
  pottery: number
  whiskey: number
  straw: number
  meat: number
  ornament: number
  bread: number
  wine: number
  beer: number
  reliquary: number
}

export type GameUnparsedAction = string[]

export type GameActionCommit = { command: GameCommandEnum.COMMIT; params: undefined }
export type GameActionConfig = { command: GameCommandEnum.CONFIG; params: GameCommandConfigParams }
export type GameActionStart = { command: GameCommandEnum.START; params: GameCommandStartParams }
export type GameActionUndefined = { command: undefined; params: undefined }
export type GameAction = GameActionCommit | GameActionConfig | GameActionStart | GameActionUndefined

export type GameState = {
  randGen: PCGState
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
  players?: Tableau[]
}

export type GameCommand = (state: GameState, params?: unknown) => GameState | undefined

export type Reducer = (state: GameState, action: string[]) => GameState | undefined

export type Parser = (action: GameUnparsedAction) => GameAction
