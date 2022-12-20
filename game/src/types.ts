import { PCGState } from 'fn-pcg'

export enum GameCommandEnum {
  CONFIG = 'CONFIG',
  START = 'START',
  COMMIT = 'COMMIT',
  USE = 'USE',
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
  Sheep = 'Sh',
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
  Beer = 'Be',
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

export type GameCommandUseParams = {
  building?: BuildingEnum
  p1?: ResourceEnum[]
  p2?: ResourceEnum[]
  coords?: number[][] // TODO??
}

export enum Clergy {
  LayBrother1R = 'LB1R',
  LayBrother2R = 'LB2R',
  PriorR = 'PRIR',
  LayBrother1G = 'LB1G',
  LayBrother2G = 'LB2G',
  PriorG = 'PRIG',
  LayBrother1B = 'LB1B',
  LayBrother2B = 'LB2B',
  PriorB = 'PRIB',
  LayBrother1W = 'LB1W',
  LayBrother2W = 'LB2W',
  PriorW = 'PRIW',
}

export type Tile = [LandEnum, BuildingEnum?, Clergy?]

export type Tableau = {
  color: PlayerColor
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
    grain?: number
    peat?: number
    sheep?: number
    grape?: number
    stone?: number
  }
  players?: Tableau[]
  settling: boolean
  extraRound: boolean
  moveInRound?: number
  round?: number
  startingPlayer?: number
  plotPurchasePrices: number[]
  districtPurchasePrices: number[]
}

export type GameCommand = (state: GameState, params?: unknown) => GameState | undefined

export type Reducer = (state: GameState, action: string[]) => GameState | undefined

export type Parser = (action: GameUnparsedAction) => GameAction

export enum SettlementRound {
  L = 'L',
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}

// export type GameMode = {
//   roundBuildings: BuildingEnum[]
//   futureBuildings: BuildingEnum[]
//   isExtraRound: (round: number) => boolean
//   roundBeforeSettlement: (round: number) => SettlementRound | undefined
//   postMove: (state: GameState) => GameState
//   isNeutralBuidingPhase: boolean
//   preRound: (state: GameState) => GameState
//   postRound: (state: GameState) => GameState
//   grapeActiveOnRound: number
//   stoneActiveOnRound: number
//   jokerActiveOnRound: number
//   movesInRound: number
//   lastSettlementAfterRound: number
//   customizeLandscape?: (landscape: Tile[][]) => Tile[][]
//   productionBonusActive: boolean
//   roundStartBonusActive: boolean
//   secondLayBrotherUsed: boolean
//   distributeProductionBonus: () => never
//   plotPurchasePrices: number[]
//   districtPurchasePrices: number[]
//   neutralPlayerUsed: boolean
//   grapesUsed: boolean
//   stoneUsed: boolean
//   priorSpecialInExtraRound: boolean
// }
