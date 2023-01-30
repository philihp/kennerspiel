import { PCGState } from 'fn-pcg'

export enum GameCommandEnum {
  CONFIG = 'CONFIG',
  START = 'START',
  COMMIT = 'COMMIT',
  WITH_PRIOR = 'WITH_PRIOR',
  USE = 'USE',
  CUT_PEAT = 'CUT_PEAT',
  FELL_TREES = 'FELL_TREES',
  BUILD = 'BUILD',
  CONVERT = 'CONVERT',
  BUY_PLOT = 'BUY_PLOT',
  BUY_DISTRICT = 'BUY_DISTRICT',
}

export type GameConfigPlayers = 1 | 2 | 3 | 4
export type GameConfigLength = 'short' | 'long'
export type GameConfigCountry = 'ireland' | 'france'

export type GameCommandConfigParams = {
  players: GameConfigPlayers
  length: GameConfigLength
  country: GameConfigCountry
}

export type GameCommandBuyDistrictParams = {
  y: number
  side: 'PLAINS' | 'HILLS'
}
export type GameCommandBuyPlotParams = {
  y: number
  side: 'MOUNTAIN' | 'COAST'
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

export enum SettlementRound {
  L = 'L', // landscape
  S = 'S', // starting
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}

export enum LandEnum {
  Hillside = 'H',
  Plains = 'P',
  Coast = 'C',
  Water = 'W',
  Mountain = 'M',
  BelowMountain = '.',
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

export enum SettlementEnum {
  ShantyTownR = 'SR1',
  ShantyTownB = 'SB1',
  ShantyTownG = 'SG1',
  ShantyTownW = 'SW1',
  FarmingVillageR = 'SR2',
  FarmingVillageB = 'SB2',
  FarmingVillageG = 'SG2',
  FarmingVillageW = 'SW2',
  MarketTownR = 'SR3',
  MarketTownB = 'SB3',
  MarketTownG = 'SG3',
  MarketTownW = 'SW3',
  FishingVillageR = 'SR4',
  FishingVillageB = 'SB4',
  FishingVillageG = 'SG4',
  FishingVillageW = 'SW4',
  ArtistsColonyR = 'SR5',
  ArtistsColonyB = 'SB5',
  ArtistsColonyG = 'SG5',
  ArtistsColonyW = 'SW5',
  HamletR = 'SR6',
  HamletB = 'SB6',
  HamletG = 'SG6',
  HamletW = 'SW6',
  VillageR = 'SR7',
  VillageB = 'SB7',
  VillageG = 'SG7',
  VillageW = 'SW7',
  HilltopVillageR = 'SR8',
  HilltopVillageB = 'SB8',
  HilltopVillageG = 'SG8',
  HilltopVillageW = 'SW8',
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
  // Start
  Priory = 'G01',
  CloisterCourtyard = 'G02',
  GrainStorage = 'F03',
  Granary = 'I03',
  Windmill = 'F04',
  Malthouse = 'I04',
  Bakery = 'F05',
  Brewery = 'I05',
  FuelMerchant = 'G06',
  PeatCoalKiln = 'G07',
  Market = 'F08',
  FalseLighthouse = 'I08',
  CloisterGarden = 'F09',
  SpinningMill = 'I09',
  Carpentry = 'F10',
  Cottage = 'I10',
  HarborPromenade = 'F11',
  Houseboat = 'I11',
  StoneMerchant = 'G12',
  BuildersMarket = 'G13',
  // A
  GrapevineA = 'F12',
  SacredSite = 'I14',
  FinancedEstate = 'F15',
  DruidsHouse = 'I15',
  CloisterChapterHouse = 'G16',
  CloisterLibrary = 'F17',
  Scriptorium = 'I17',
  CloisterWorkshop = 'G18',
  Slaughterhouse = 'G19',
  // B
  Inn = 'F20',
  Alehouse = 'I20',
  Winery = 'F21',
  WhiskeyDistillery = 'I21',
  QuarryA = 'G22',
  Bathhouse = 'F23',
  Locutory = 'I23',
  CloisterChurch = 'F24',
  Chapel = 'I24',
  ChamberOfWonders = 'F25',
  Portico = 'I25',
  Shipyard = 'G26',
  // C
  Palace = 'F27',
  GrandManor = 'I27',
  Castle = 'G28',
  QuarryB = 'F29',
  ForestHut = 'I29',
  TownEstate = 'F30',
  Refectory = 'I30',
  GrapevineB = 'F31',
  CoalHarbor = 'I31',
  Calefactory = 'F32',
  FilialChurch = 'I32',
  ShippingCompany = 'F33',
  Cooperage = 'I33',
  // D
  Sacristy = 'G34',
  ForgersWorkshop = 'F35',
  RoundTower = 'I35',
  PilgrimageSite = 'F36',
  Camera = 'I36',
  Dormitory = 'F37',
  Bulwark = 'I37',
  PrintingOffice = 'F38',
  FestivalGround = 'I38',
  Estate = 'G39',
  Hospice = 'F40',
  Guesthouse = 'I40',
  HouseOfTheBrotherhood = 'G41',
}

export enum NextUseClergy {
  Any = 'any', // next use can use any clergy (prefer lay)
  OnlyPrior = 'only-prior', // next use must use prior, or it will fail
  Free = 'free', // next use does not move a clergy
  None = 'none', // next use must always fail
}

type UsageOfClergy = {
  usePrior?: boolean
}
export type UsageParamSingle = UsageOfClergy & {
  param: string
}
export type UsageParamDouble = UsageOfClergy & {
  p1: string
  p2: string
}
export type UsageParamCoord = UsageOfClergy & {
  row: number
  col: number
}
export type UsageParamCoords = UsageOfClergy & {
  coords: { row: number; col: number }[]
}

export type GameCommandCutPeatParams = {
  row: number
  col: number
  useJoker: boolean
}

export type GameCommandBuildParams = {
  row: number
  col: number
  building: BuildingEnum
}

export type GameCommandFellTreesParams = {
  row: number
  col: number
  useJoker: boolean
}

export type Cost = {
  peat?: number
  penny?: number
  clay?: number
  wood?: number
  grain?: number
  sheep?: number
  stone?: number
  flour?: number
  grape?: number
  nickel?: number
  hops?: number
  coal?: number
  book?: number
  pottery?: number
  whiskey?: number
  straw?: number
  meat?: number
  ornament?: number
  bread?: number
  wine?: number
  beer?: number
  reliquary?: number
}

export type GameCommandConvertParams = Cost

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

export type Tile = [LandEnum?, BuildingEnum?, Clergy?]

// TODO: try to Required<Cost> &
export type Tableau = {
  color: PlayerColor
  clergy: Clergy[]
  settlements: SettlementEnum[]
  landscape: Tile[][]
  landscapeOffset: number
  wonders: number
  peat: number
  penny: number
  clay: number
  wood: number
  grain: number
  sheep: number
  stone: number
  flour: number
  grape: number
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

export type Rondel = {
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

export type GameActionCommit = { command: GameCommandEnum.COMMIT }
export type GameActionConfig = { command: GameCommandEnum.CONFIG; params: GameCommandConfigParams }
export type GameActionConvert = { command: GameCommandEnum.CONVERT; params: GameCommandConvertParams }
export type GameActionStart = { command: GameCommandEnum.START; params: GameCommandStartParams }
export type GameActionCutPeat = { command: GameCommandEnum.CUT_PEAT; params: GameCommandCutPeatParams }
export type GameActionFellTrees = { command: GameCommandEnum.FELL_TREES; params: GameCommandFellTreesParams }
export type GameActionUndefined = undefined
export type GameAction =
  | GameActionCommit
  | GameActionConfig
  | GameActionStart
  | GameActionCutPeat
  | GameActionFellTrees
  | GameActionUndefined

export type GameStateSetup = {
  status: GameStatusEnum.SETUP
  randGen: PCGState
  players?: Tableau[]
  config?: GameCommandConfigParams
  rondel?: Rondel
}
export type GameStatePlaying = {
  status: GameStatusEnum.PLAYING | GameStatusEnum.FINISHED
  randGen: PCGState
  activePlayerIndex: number
  config: GameCommandConfigParams
  rondel: Rondel
  wonders: number
  players: Tableau[]
  neutralPlayer?: Tableau
  neutralBuildingPhase: boolean
  settling: boolean
  extraRound: boolean
  moveInRound: number
  round: number
  startingPlayer: number
  settlementRound: SettlementRound
  buildings: BuildingEnum[]
  usableBuildings?: BuildingEnum[]
  nextUse: NextUseClergy
  canBuyLandscape: boolean
  plotPurchasePrices: number[]
  districtPurchasePrices: number[]
}
export type GameState = GameStateSetup | GameStatePlaying

export type Reducer = (state: GameState, action: string[]) => GameState | undefined

export type PreMoveHandler = (state: GameStatePlaying | undefined) => GameStatePlaying | undefined
export type PostMoveHandler = (state: GameStatePlaying) => GameStatePlaying | undefined
export type PostRoundHandler = (state: GameStatePlaying) => GameStatePlaying | undefined
