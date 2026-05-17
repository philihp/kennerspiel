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
  GameStatePlaying,
  GameStatusEnum,
  LandEnum,
  NextUseClergy,
  PlayerColor,
  Rondel,
  SettlementEnum,
  SettlementRound,
  Tableau,
} from './types'
import { clergyForColor, isPrior } from './board/player'

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

const SHARED_LEN =
  RONDEL_KEYS.length + // normalized rondel deltas
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

// Rotate so `perspective` lands in slot 0. Slots past players.length stay
// undefined (zero-padded block).
const rotateOrder = (numPlayers: number, perspective: number): (number | undefined)[] => {
  const order: (number | undefined)[] = []
  for (let slot = 0; slot < MAX_PLAYERS; slot++) {
    order.push(slot < numPlayers ? (perspective + slot) % numPlayers : undefined)
  }
  return order
}

const writeTableau = (
  out: Float32Array,
  base: number,
  t: Tableau,
  isSelf: boolean,
  config: GameCommandConfigParams
): number => {
  let o = base
  for (const r of RESOURCES) out[o++] = t[r] ?? 0
  out[o++] = t.wonders

  const unplaced = new Set<Clergy>(t.clergy)
  let lbUnplaced = 0
  let lbPlaced = 0
  let priorUnplaced = 0
  let priorPlaced = 0
  for (const c of clergyForColor(config)(t.color)) {
    const placed = !unplaced.has(c)
    if (isPrior(c)) {
      if (placed) priorPlaced++
      else priorUnplaced++
    } else {
      if (placed) lbPlaced++
      else lbUnplaced++
    }
  }
  out[o++] = lbUnplaced
  out[o++] = lbPlaced
  out[o++] = priorUnplaced
  out[o++] = priorPlaced

  const inHand = new Set<SettlementEnum>(t.settlements)
  for (const s of SETTLEMENTS) out[o++] = inHand.has(s) ? 1 : 0

  const gridBase = o
  for (let r = 0; r < t.landscape.length; r++) {
    const row = t.landscape[r]
    const outputRow = r - t.landscapeOffset + ANCHOR
    if (outputRow < 0 || outputRow >= H) continue
    const cols = Math.min(row.length, W)
    for (let c = 0; c < cols; c++) {
      const tile = row[c]
      if (tile === undefined) continue
      const [land, erection, clergy] = tile
      const cell = gridBase + (outputRow * W + c) * TILE_CH
      if (land !== undefined) {
        const li = LANDS.indexOf(land)
        if (li >= 0) out[cell + li] = 1
      }
      if (erection !== undefined) {
        const ei = erectionIndex(erection)
        if (ei >= 0) out[cell + LAND_CH + ei] = 1
      }
      if (clergy !== undefined) {
        const off = cell + LAND_CH + ERECT_CH
        out[off + (isPrior(clergy) ? 1 : 0)] = 1
        if (!isSelf) out[off + 2] = 1
      }
    }
  }
  return base + PLAYER_BLOCK
}

const writeFrame = (out: Float32Array, base: number, frame: Frame, order: (number | undefined)[]): number => {
  let o = base
  out[o++] = frame.round

  const srIdx = SETTLEMENT_ROUNDS.indexOf(frame.settlementRound)
  if (srIdx >= 0) out[o + srIdx] = 1
  o += SETTLEMENT_ROUNDS.length

  const currentSlot = order.indexOf(frame.currentPlayerIndex)
  if (currentSlot >= 0) out[o + currentSlot] = 1
  o += MAX_PLAYERS

  const activeSlot = order.indexOf(frame.activePlayerIndex)
  if (activeSlot >= 0) out[o + activeSlot] = 1
  o += MAX_PLAYERS

  out[o++] = frame.mainActionUsed ? 1 : 0
  out[o++] = frame.neutralBuildingPhase ? 1 : 0
  out[o++] = frame.bonusRoundPlacement ? 1 : 0
  out[o++] = frame.canBuyLandscape ? 1 : 0

  const bonusSet = new Set<GameCommandEnum>(frame.bonusActions)
  for (const cmd of COMMANDS) out[o++] = bonusSet.has(cmd) ? 1 : 0

  const nuIdx = NEXT_USES.indexOf(frame.nextUse)
  if (nuIdx >= 0) out[o + nuIdx] = 1
  o += NEXT_USES.length

  const usable = new Set<BuildingEnum>(frame.usableBuildings)
  for (const b of BUILDINGS) out[o++] = usable.has(b) ? 1 : 0
  const unusable = new Set<BuildingEnum>(frame.unusableBuildings)
  for (const b of BUILDINGS) out[o++] = unusable.has(b) ? 1 : 0

  return base + FRAME_LEN
}

const writeShared = (out: Float32Array, base: number, state: GameStatePlaying): number => {
  let o = base
  const { rondel } = state
  for (const key of RONDEL_KEYS) {
    const slot = rondel[key]
    if (slot === undefined) out[o++] = 0
    else {
      const delta = (((slot - rondel.pointingBefore) % RONDEL_PERIOD) + RONDEL_PERIOD) % RONDEL_PERIOD
      out[o++] = delta / RONDEL_PERIOD
    }
  }

  const available = new Set<BuildingEnum>(state.buildings)
  for (const b of BUILDINGS) out[o++] = available.has(b) ? 1 : 0

  for (let i = 0; i < MAX_PRICE_SLOTS; i++) out[o++] = state.plotPurchasePrices[i] ?? 0
  for (let i = 0; i < MAX_PRICE_SLOTS; i++) out[o++] = state.districtPurchasePrices[i] ?? 0

  out[o++] = state.wonders

  const playerSlots = Math.min(MAX_PLAYERS, state.config.players)
  out[o + (playerSlots - 1)] = 1
  o += MAX_PLAYERS

  const lenIdx = LENGTHS.indexOf(state.config.length)
  if (lenIdx >= 0) out[o + lenIdx] = 1
  o += LENGTHS.length

  const countryIdx = COUNTRIES.indexOf(state.config.country)
  if (countryIdx >= 0) out[o + countryIdx] = 1
  o += COUNTRIES.length

  return base + SHARED_LEN
}

export const encode = (state: GameState, perspective?: number): Float32Array => {
  const out = new Float32Array(FEATURE_LEN)
  if (state.status === GameStatusEnum.SETUP) return out

  const playing = state
  const p = perspective ?? playing.frame.currentPlayerIndex
  const order = rotateOrder(playing.players.length, p)

  let o = 0
  for (let slot = 0; slot < MAX_PLAYERS; slot++) {
    const idx = order[slot]
    if (idx === undefined) {
      o += PLAYER_BLOCK
      continue
    }
    o = writeTableau(out, o, playing.players[idx], slot === 0, playing.config)
  }
  o = writeFrame(out, o, playing.frame, order)
  o = writeShared(out, o, playing)
  return out
}
