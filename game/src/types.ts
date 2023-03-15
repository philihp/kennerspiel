import { PCGState } from 'fn-pcg'

export enum GameCommandEnum {
  CONFIG = 'CONFIG',
  START = 'START',
  COMMIT = 'COMMIT',
  WORK_CONTRACT = 'WORK_CONTRACT',
  WITH_PRIOR = 'WITH_PRIOR',
  WITH_LAYBROTHER = 'WITH_LAYBROTHER',
  USE = 'USE',
  CUT_PEAT = 'CUT_PEAT',
  FELL_TREES = 'FELL_TREES',
  BUILD = 'BUILD',
  CONVERT = 'CONVERT',
  BUY_PLOT = 'BUY_PLOT',
  BUY_DISTRICT = 'BUY_DISTRICT',
  SETTLE = 'SETTLE',
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
  Ceramic = 'Ce', // used to be Pottery/Po
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
  Malt = 'Ma', // used to be Hops/Ho
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
  GrapevineA = 'F14',
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

export type ErectionEnum = SettlementEnum | BuildingEnum

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

export type GameCommandSettleParams = {
  row: number
  col: number
  settlement: SettlementEnum
  resources: string
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
  malt?: number
  coal?: number
  book?: number
  ceramic?: number
  whiskey?: number
  straw?: number
  meat?: number
  ornament?: number
  bread?: number
  wine?: number
  beer?: number
  reliquary?: number
}

export type SettlementCost = {
  food: number
  energy: number
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
  malt: number
  coal: number
  book: number
  ceramic: number
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

export enum NextUseClergy {
  Any = 'any', // next use can use any clergy, using laybrother first
  OnlyPrior = 'only-prior', // next use must use prior, or it will fail
  Free = 'free', // next use does not move a clergy
}

export type Frame = {
  next: number

  // primarily this is ornamental, display the starting player market
  startingPlayer: number

  // removing these, i think they're actually not needed
  // moveInRound: number
  // round: number

  // also ornamental, however important for triggering end of game in 2p
  settlementRound: SettlementRound

  // activePlayer: this is the player we're waiting input from
  // currentPlayer: this is the player whose turn it is.
  // most of the time, this is going to be the same thing, however sometimes we need
  // input from someone who isn't the current player... I'm thinking like if someone
  // has been work contracted (and they can only give us either "COMMIT" or "WITH_PRIOR")
  currentPlayerIndex: number
  activePlayerIndex: number

  // if this is true, then BUILDs will happen on the neutral board
  neutralBuildingPhase: boolean

  // if this is true, only settlement and conversion will be allowed
  // removing this, settlmeent round should just add settle to bonus actions
  // settling: boolean

  // if this is true (which would be the case in a bonus round), then the prior may be placed on
  // another player's board, and can be placed there even if it is occupied.
  bonusRoundPlacement: boolean

  // consume this first, if a main action is used by:
  // - fell_trees
  // - cut_peat
  // - work_contract
  // - build
  // - use
  mainActionUsed: boolean

  // if that's false, then check this list to see if the player can do the action
  // if they do it, specifically remove that command from this list, which could come from:
  // - locutory (build)
  // - calefactory (cut-peat + fell trees)
  // - castle (settlement)
  // - bullwark (buy_district, buy_plot... which are free, if in this list)
  bonusActions: GameCommandEnum[]

  // player can buy a landscape, but must pay cost
  canBuyLandscape: boolean

  // if mainActionUsed === true and bonusActions === [], "use" still possible, provided...
  // the building is not in this list
  unusableBuildings: BuildingEnum[]
  // AND the building *IS* in this list
  usableBuildings: BuildingEnum[]

  // if the player tried to "use", then this determines if a clergy is placed
  nextUse: NextUseClergy
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
  config: GameCommandConfigParams
  rondel: Rondel
  wonders: number
  players: Tableau[]
  neutralPlayer?: Tableau
  buildings: BuildingEnum[]
  plotPurchasePrices: number[]
  districtPurchasePrices: number[]
  frame: Frame
}
export type GameState = GameStateSetup | GameStatePlaying

export type StateReducer = (state: GameStatePlaying | undefined) => GameStatePlaying | undefined

export type TableauReducer = (state: Tableau | undefined) => Tableau | undefined

export type FrameFlow = Record<
  number,
  {
    upkeep?: ((state: GameStatePlaying | undefined) => GameStatePlaying | undefined)[]
    next: number
  } & Partial<Frame>
>
