import { range } from 'ramda'
import {
  BuildingEnum,
  Clergy,
  Cost,
  ErectionEnum,
  Frame,
  GameCommandConfigParams,
  GameCommandEnum,
  GameConfigCountry,
  GameConfigLength,
  GameState,
  GameStatusEnum,
  LandEnum,
  NextUseClergy,
  Rondel,
  SettlementEnum,
  SettlementRound,
  Tableau,
  Tile,
} from './types'
import { clergyForColor, isPrior } from './board/player'
import { take } from './board/rondel'

// Stable enum orderings. New entries get APPENDED; never reorder, or saved
// model weights will silently misalign with feature slots.
const BUILDINGS = Object.values(BuildingEnum) as BuildingEnum[]
const SETTLEMENTS = Object.values(SettlementEnum) as SettlementEnum[]
const LANDS = Object.values(LandEnum) as LandEnum[]
const COMMANDS = Object.values(GameCommandEnum) as GameCommandEnum[]
const SETTLEMENT_ROUNDS = Object.values(SettlementRound) as SettlementRound[]
const NEXT_USES = Object.values(NextUseClergy) as NextUseClergy[]
const LENGTHS: GameConfigLength[] = ['short', 'long']
const COUNTRIES: GameConfigCountry[] = ['ireland', 'france']
const RONDEL_KEYS: (keyof Omit<Rondel, 'pointingBefore'>)[] = [
  'wood',
  'clay',
  'coin',
  'joker',
  'grain',
  'peat',
  'sheep',
  'grape',
  'stone',
]
const RESOURCES: (keyof Required<Cost>)[] = [
  'peat',
  'penny',
  'clay',
  'wood',
  'grain',
  'sheep',
  'stone',
  'flour',
  'grape',
  'nickel',
  'malt',
  'coal',
  'book',
  'ceramic',
  'whiskey',
  'straw',
  'meat',
  'ornament',
  'bread',
  'wine',
  'beer',
  'reliquary',
]

// The landscape grid is anchored: a player's "logical row 0" (the first
// row of their original 2-row starting board) always sits at output row
// `ANCHOR`. With up to 9 districts + 9 plots — each 2 rows tall — that can
// extend the board in either direction, the worst case is 18 rows above
// and 18 rows below, plus the 2 starting rows. H = 38, ANCHOR = 18 covers
// it. Output_row = (raw_row - landscapeOffset) + ANCHOR.
const H = 38
const W = 9
const ANCHOR = 18
const MAX_PLAYERS = 4
const RONDEL_PERIOD = 13
const MAX_PRICE_SLOTS = 9

const LAND_CH = LANDS.length
const ERECT_CH = BUILDINGS.length + SETTLEMENTS.length
const CLERGY_CH = 3 // [laybrother, prior, owned-by-opponent]
const TILE_CH = LAND_CH + ERECT_CH + CLERGY_CH

const PLAYER_SCALAR_LEN =
  RESOURCES.length + // resource counts
  1 + // wonders
  4 + // [lb_unplaced, lb_placed, prior_unplaced, prior_placed]
  SETTLEMENTS.length // in-hand mask
const PLAYER_GRID_LEN = H * W * TILE_CH
const PLAYER_BLOCK = PLAYER_SCALAR_LEN + PLAYER_GRID_LEN

const FRAME_LEN =
  1 + // round
  SETTLEMENT_ROUNDS.length + // one-hot
  MAX_PLAYERS + // currentPlayerIndex one-hot (post-rotation slot 0)
  MAX_PLAYERS + // activePlayerIndex one-hot
  4 + // mainActionUsed, neutralBuildingPhase, bonusRoundPlacement, canBuyLandscape
  COMMANDS.length + // bonusActions mask
  NEXT_USES.length + // one-hot
  BUILDINGS.length * 2 // usableBuildings + unusableBuildings

// Yields max out at 10 on either arm-value table (see armValues in
// board/rondel.ts). Normalize by this so the feature sits in [0, 1].
const MAX_RONDEL_YIELD = 10

const SHARED_LEN =
  RONDEL_KEYS.length + // normalized rondel deltas
  RONDEL_KEYS.length + // normalized rondel yields (what each token gives if taken now)
  BUILDINGS.length + // still-available buildings mask
  MAX_PRICE_SLOTS * 2 + // plot + district prices (zero-padded)
  1 + // wonders remaining
  MAX_PLAYERS + // config.players one-hot
  LENGTHS.length + // config.length one-hot
  COUNTRIES.length // config.country one-hot

export const FEATURE_LEN = MAX_PLAYERS * PLAYER_BLOCK + FRAME_LEN + SHARED_LEN

export type FeatureSpec = {
  featureLen: number
  height: number
  width: number
  gridAnchor: number
  maxPlayers: number
  tileChannels: number
  offsets: {
    players: number[]
    frame: number
    shared: number
  }
  vocab: {
    buildings: BuildingEnum[]
    settlements: SettlementEnum[]
    lands: LandEnum[]
    commands: GameCommandEnum[]
    resources: (keyof Required<Cost>)[]
    rondelKeys: (keyof Omit<Rondel, 'pointingBefore'>)[]
    settlementRounds: SettlementRound[]
    nextUses: NextUseClergy[]
    lengths: GameConfigLength[]
    countries: GameConfigCountry[]
  }
}

export const featureSpec: FeatureSpec = {
  featureLen: FEATURE_LEN,
  height: H,
  width: W,
  gridAnchor: ANCHOR,
  maxPlayers: MAX_PLAYERS,
  tileChannels: TILE_CH,
  offsets: {
    players: [0, PLAYER_BLOCK, PLAYER_BLOCK * 2, PLAYER_BLOCK * 3],
    frame: MAX_PLAYERS * PLAYER_BLOCK,
    shared: MAX_PLAYERS * PLAYER_BLOCK + FRAME_LEN,
  },
  vocab: {
    buildings: BUILDINGS,
    settlements: SETTLEMENTS,
    lands: LANDS,
    commands: COMMANDS,
    resources: RESOURCES,
    rondelKeys: RONDEL_KEYS,
    settlementRounds: SETTLEMENT_ROUNDS,
    nextUses: NEXT_USES,
    lengths: LENGTHS,
    countries: COUNTRIES,
  },
}

const erectionIndex = (e: ErectionEnum): number => {
  const b = BUILDINGS.indexOf(e as BuildingEnum)
  if (b >= 0) return b
  const s = SETTLEMENTS.indexOf(e as SettlementEnum)
  if (s >= 0) return BUILDINGS.length + s
  return -1
}

const oneHot = <T>(domain: readonly T[], target: T | undefined): number[] =>
  domain.map((v) => (v === target ? 1 : 0))

const mask = <T>(domain: readonly T[], set: ReadonlySet<T>): number[] => domain.map((v) => (set.has(v) ? 1 : 0))

const slotOneHot = (slot: number): number[] => range(0, MAX_PLAYERS).map((i) => (i === slot ? 1 : 0))

// Rotate so `perspective` lands in slot 0. Slots past players.length stay
// undefined (zero-padded block).
const rotateOrder = (numPlayers: number, perspective: number): (number | undefined)[] =>
  range(0, MAX_PLAYERS).map((slot) => (slot < numPlayers ? (perspective + slot) % numPlayers : undefined))

const tileChannels = (tile: Tile | undefined, isSelf: boolean): number[] => {
  const channels = range(0, TILE_CH).map(() => 0)
  if (tile === undefined) return channels
  const [land, erection, clergy] = tile
  if (land !== undefined) {
    const li = LANDS.indexOf(land)
    if (li >= 0) channels[li] = 1
  }
  if (erection !== undefined) {
    const ei = erectionIndex(erection)
    if (ei >= 0) channels[LAND_CH + ei] = 1
  }
  if (clergy !== undefined) {
    channels[LAND_CH + ERECT_CH + (isPrior(clergy) ? 1 : 0)] = 1
    if (!isSelf) channels[LAND_CH + ERECT_CH + 2] = 1
  }
  return channels
}

const encodeGrid = (t: Tableau, isSelf: boolean): number[] =>
  range(0, H).flatMap((outputRow) => {
    const row = t.landscape[outputRow + t.landscapeOffset - ANCHOR]
    return range(0, W).flatMap((c) => tileChannels(row?.[c], isSelf))
  })

const clergyBuckets = (t: Tableau, config: GameCommandConfigParams): number[] => {
  const unplaced = new Set<Clergy>(t.clergy)
  const counts = clergyForColor(config)(t.color).reduce(
    (acc, c) => {
      const placed = !unplaced.has(c)
      if (isPrior(c)) return placed ? { ...acc, priorPlaced: acc.priorPlaced + 1 } : { ...acc, priorUnplaced: acc.priorUnplaced + 1 }
      return placed ? { ...acc, lbPlaced: acc.lbPlaced + 1 } : { ...acc, lbUnplaced: acc.lbUnplaced + 1 }
    },
    { lbUnplaced: 0, lbPlaced: 0, priorUnplaced: 0, priorPlaced: 0 }
  )
  return [counts.lbUnplaced, counts.lbPlaced, counts.priorUnplaced, counts.priorPlaced]
}

const encodeTableau = (t: Tableau, isSelf: boolean, config: GameCommandConfigParams): number[] => {
  const sections: number[][] = [
    RESOURCES.map((r) => t[r] ?? 0),
    [t.wonders],
    clergyBuckets(t, config),
    mask(SETTLEMENTS, new Set(t.settlements)),
    encodeGrid(t, isSelf),
  ]
  return sections.flat()
}

const encodeFrame = (frame: Frame, order: (number | undefined)[]): number[] => {
  const sections: number[][] = [
    [frame.round],
    oneHot(SETTLEMENT_ROUNDS, frame.settlementRound),
    slotOneHot(order.indexOf(frame.currentPlayerIndex)),
    slotOneHot(order.indexOf(frame.activePlayerIndex)),
    [
      frame.mainActionUsed ? 1 : 0,
      frame.neutralBuildingPhase ? 1 : 0,
      frame.bonusRoundPlacement ? 1 : 0,
      frame.canBuyLandscape ? 1 : 0,
    ],
    mask(COMMANDS, new Set(frame.bonusActions)),
    oneHot(NEXT_USES, frame.nextUse),
    mask(BUILDINGS, new Set(frame.usableBuildings)),
    mask(BUILDINGS, new Set(frame.unusableBuildings)),
  ]
  return sections.flat()
}

const encodeRondelDeltas = (rondel: Rondel): number[] =>
  RONDEL_KEYS.map((key) => {
    const slot = rondel[key]
    if (slot === undefined) return 0
    const delta = (((slot - rondel.pointingBefore) % RONDEL_PERIOD) + RONDEL_PERIOD) % RONDEL_PERIOD
    return delta / RONDEL_PERIOD
  })

const encodeRondelYields = (rondel: Rondel, config: GameCommandConfigParams): number[] =>
  RONDEL_KEYS.map((key) => {
    const slot = rondel[key]
    if (slot === undefined) return 0
    return take(rondel.pointingBefore, slot, config) / MAX_RONDEL_YIELD
  })

const padPrices = (prices: readonly number[]): number[] =>
  range(0, MAX_PRICE_SLOTS).map((i) => prices[i] ?? 0)

const encodeShared = (state: GameState): number[] => {
  const playerCountOneHot = range(0, MAX_PLAYERS).map((i) => (i === state.config!.players - 1 ? 1 : 0))
  const sections: number[][] = [
    encodeRondelDeltas(state.rondel!),
    encodeRondelYields(state.rondel!, state.config!),
    mask(BUILDINGS, new Set(state.buildings)),
    padPrices(state.plotPurchasePrices!),
    padPrices(state.districtPurchasePrices!),
    [state.wonders!],
    playerCountOneHot,
    oneHot(LENGTHS, state.config!.length),
    oneHot(COUNTRIES, state.config!.country),
  ]
  return sections.flat()
}

export const encode = (state: GameState, perspective?: number): Float32Array => {
  if (state.status === GameStatusEnum.SETUP) return new Float32Array(FEATURE_LEN)
  const p = perspective ?? state.frame!.currentPlayerIndex
  const order = rotateOrder(state.players!.length, p)
  const sections: number[][] = [
    ...order.map((idx, slot): number[] =>
      idx === undefined ? range(0, PLAYER_BLOCK).map(() => 0) : encodeTableau(state.players![idx], slot === 0, state.config!)
    ),
    encodeFrame(state.frame!, order),
    encodeShared(state),
  ]
  return Float32Array.from(sections.flat())
}
