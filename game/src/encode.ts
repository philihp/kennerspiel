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

// ===========================================================================
// Feature encoder — turns a GameState into a flat Float32Array for a tensor.
//
// Design notes (see docs/mcts-self-play-plan.md):
//  - Egocentric: players are emitted current-player-first, then the next
//    player to act, etc. (slot 0 is always "me"). Pass `perspective` to encode
//    from a specific player's view; defaults to the current player.
//  - Compact: a tile's erection is a single CATEGORICAL channel holding an
//    integer id (0 = empty, 1..N = a color-agnostic building/settlement type),
//    NOT a one-hot. The model embeds it. This keeps the tensor shape constant
//    as new buildings ship — only the embedding table indexes more rows.
//  - Forward-compatible: everywhere the building/settlement vocabulary appears
//    (the erection id and the three building masks) is sized to VOCAB_CAPACITY,
//    so adding variant/expansion buildings never changes FEATURE_LEN.
//
// Stability rule: enum orderings below are APPEND-ONLY. Never reorder — saved
// model weights are keyed by these slot/id positions and will silently
// misalign otherwise. New buildings appended to BuildingEnum get new ids at
// the end; existing ids (and existing weights) stay valid.
// ===========================================================================

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

// --- Color-agnostic erection vocabulary -----------------------------------
// A colored tile (ClayMoundR/G/B/W, FarmYard*, CloisterOffice*, settlements
// SR1..SW8) only ever sits on its owner's board, and slot 0 is always "me",
// so color is fully redundant with which player's grid the tile is in. We
// collapse it. Country variants (F03 vs I03) stay DISTINCT — they are
// different buildings, not colors.
const genericBuildingKey = (b: BuildingEnum): string => {
  const m = /^L([RGBW])([123])$/.exec(b)
  if (m) return ['', 'ClayMound', 'FarmYard', 'CloisterOffice'][Number(m[2])]
  return b
}
const settlementTypeKey = (s: SettlementEnum): string => {
  const m = /^S[RGBW]([1-8])$/.exec(s)
  return `Settlement${m ? m[1] : s}`
}

// Keep first occurrence only. Runs once at module load over tiny vocab arrays,
// so the O(n^2) indexOf is irrelevant — this is not the hot path.
const dedupeInOrder = (keys: string[]): string[] => keys.filter((k, i) => keys.indexOf(k) === i)

const GENERIC_BUILDINGS = dedupeInOrder(BUILDINGS.map(genericBuildingKey)) // 72
const SETTLEMENT_TYPES = dedupeInOrder(SETTLEMENTS.map(settlementTypeKey)) // 8
// Unified erection vocab: buildings first, then settlement types. Index here
// is the embedding id minus one (id 0 is reserved for "empty tile").
const ERECTION_VOCAB = [...GENERIC_BUILDINGS, ...SETTLEMENT_TYPES]

const buildingMaskIndex = new Map<BuildingEnum, number>()
BUILDINGS.forEach((b) => buildingMaskIndex.set(b, GENERIC_BUILDINGS.indexOf(genericBuildingKey(b))))
const settlementHandIndex = new Map<SettlementEnum, number>()
SETTLEMENTS.forEach((s) => settlementHandIndex.set(s, SETTLEMENT_TYPES.indexOf(settlementTypeKey(s))))

// erection id: 1..ERECTION_VOCAB.length (0 reserved for empty). Runs per
// occupied tile per encode, so it uses a precomputed Map (same pattern as the
// two mask indexes above) rather than an indexOf chain. Buildings map to their
// generic-vocab slot + 1; settlements sit after the buildings; any enum value
// not in the table (should never happen) falls back to 0, matching the old
// indexOf's −1 + 1.
const erectionIdMap = new Map<ErectionEnum, number>()
BUILDINGS.forEach((b) => erectionIdMap.set(b, GENERIC_BUILDINGS.indexOf(genericBuildingKey(b)) + 1))
SETTLEMENTS.forEach((s) =>
  erectionIdMap.set(s, GENERIC_BUILDINGS.length + SETTLEMENT_TYPES.indexOf(settlementTypeKey(s)) + 1)
)
export const erectionId = (e: ErectionEnum): number => erectionIdMap.get(e) ?? 0

// --- Dimensions -----------------------------------------------------------
// Grid is anchored: a player's logical row 0 always lands at output row
// ANCHOR. H/W cover the worst-case board; cells outside it are clipped (rare).
const H = 38
const W = 9
const ANCHOR = 18
const MAX_PLAYERS = 4
const RONDEL_PERIOD = 13
const MAX_PRICE_SLOTS = 9
const MAX_RONDEL_YIELD = 10 // armValues cap; normalizes yields into [0, 1]

// Reserved capacity for every building/settlement-vocab feature, so new
// expansion buildings never change FEATURE_LEN.
const VOCAB_CAPACITY = 256

// Reserved capacity for the config country one-hot. Only `ireland`/`france`
// exist today, but more countries are a stated plan; reserving slots now (same
// append-only idea as VOCAB_CAPACITY) means adding one never changes
// FEATURE_LEN and strands trained weights. `featureSpec.vocab.countries` stays
// the source of truth for which slot each live country id occupies.
const COUNTRY_CAPACITY = 8

const LAND_LEN = LANDS.length // 6
const ERECT_ID_LEN = 1 // categorical
const CLERGY_LEN = 3 // [laybrother-present, prior-present, opponent-owned]
const TILE_CH = LAND_LEN + ERECT_ID_LEN + CLERGY_LEN // 10
const ERECT_ID_CHANNEL = LAND_LEN // tile-local index of the categorical channel

const SETTLEMENT_HAND_LEN = SETTLEMENT_TYPES.length // 8
const PLAYER_SCALAR_LEN =
  RESOURCES.length + // resource counts
  1 + // wonders
  4 + // [lb_unplaced, lb_placed, prior_unplaced, prior_placed]
  SETTLEMENT_HAND_LEN // in-hand settlement types
const PLAYER_GRID_LEN = H * W * TILE_CH
const PLAYER_BLOCK = PLAYER_SCALAR_LEN + PLAYER_GRID_LEN

const FRAME_LEN =
  1 + // round
  SETTLEMENT_ROUNDS.length + // one-hot
  MAX_PLAYERS + // currentPlayerIndex one-hot (rotated slot)
  MAX_PLAYERS + // activePlayerIndex one-hot
  4 + // mainActionUsed, neutralBuildingPhase, bonusRoundPlacement, canBuyLandscape
  COMMANDS.length + // bonusActions mask
  NEXT_USES.length + // one-hot
  VOCAB_CAPACITY * 2 // usableBuildings + unusableBuildings masks

const SHARED_LEN =
  RONDEL_KEYS.length + // normalized rondel deltas
  RONDEL_KEYS.length + // normalized rondel yields
  VOCAB_CAPACITY + // still-available buildings mask
  MAX_PRICE_SLOTS * 2 + // plot + district prices
  1 + // wonders remaining
  MAX_PLAYERS + // config.players one-hot
  LENGTHS.length + // config.length one-hot
  COUNTRY_CAPACITY // config.country one-hot (reserved capacity for future countries)

export const FEATURE_LEN = MAX_PLAYERS * PLAYER_BLOCK + FRAME_LEN + SHARED_LEN

export type FeatureSpec = {
  // Bumped whenever the layout changes shape; guards every downstream artifact
  // (shard meta, ckpt, spec.json, ONNX evaluator) — see docs/trainer/schemas.md.
  // v1 was the 14,670-float layout; v2 widens the country one-hot to
  // COUNTRY_CAPACITY (14,676), the last free FEATURE_LEN change before weights ship.
  version: number
  featureLen: number
  height: number
  width: number
  gridAnchor: number
  maxPlayers: number
  tileChannels: number
  vocabCapacity: number
  tile: {
    landOffset: number
    landLen: number
    erectionIdChannel: number
    clergyOffset: number
    clergyLen: number
  }
  // Channels the model must embed rather than treat as continuous floats.
  categorical: { name: string; tileChannel: number; capacity: number; vocab: string[] }[]
  offsets: {
    players: number[]
    frame: number
    shared: number
    // offsets within one player block
    playerResources: number
    playerWonders: number
    playerClergy: number
    playerSettlements: number
    playerGrid: number
  }
  vocab: {
    erections: string[]
    buildings: string[]
    settlements: string[]
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
  version: 2,
  featureLen: FEATURE_LEN,
  height: H,
  width: W,
  gridAnchor: ANCHOR,
  maxPlayers: MAX_PLAYERS,
  tileChannels: TILE_CH,
  vocabCapacity: VOCAB_CAPACITY,
  tile: {
    landOffset: 0,
    landLen: LAND_LEN,
    erectionIdChannel: ERECT_ID_CHANNEL,
    clergyOffset: LAND_LEN + ERECT_ID_LEN,
    clergyLen: CLERGY_LEN,
  },
  categorical: [{ name: 'erection', tileChannel: ERECT_ID_CHANNEL, capacity: VOCAB_CAPACITY, vocab: ERECTION_VOCAB }],
  offsets: {
    players: [0, PLAYER_BLOCK, PLAYER_BLOCK * 2, PLAYER_BLOCK * 3],
    frame: MAX_PLAYERS * PLAYER_BLOCK,
    shared: MAX_PLAYERS * PLAYER_BLOCK + FRAME_LEN,
    playerResources: 0,
    playerWonders: RESOURCES.length,
    playerClergy: RESOURCES.length + 1,
    playerSettlements: RESOURCES.length + 1 + 4,
    playerGrid: PLAYER_SCALAR_LEN,
  },
  vocab: {
    erections: ERECTION_VOCAB,
    buildings: GENERIC_BUILDINGS,
    settlements: SETTLEMENT_TYPES,
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

// --- Imperative writer ----------------------------------------------------
// Writes straight into one preallocated buffer; no intermediate arrays.
// Float32Array is zero-initialized, so one-hots/masks only set the hot slots.
class Writer {
  pos = 0
  constructor(readonly buf: Float32Array) {}
  put(v: number): void {
    this.buf[this.pos++] = v
  }
  hot(n: number, idx: number): void {
    if (idx >= 0 && idx < n) this.buf[this.pos + idx] = 1
    this.pos += n
  }
  bits(n: number, idxs: number[]): void {
    for (const i of idxs) if (i >= 0 && i < n) this.buf[this.pos + i] = 1
    this.pos += n
  }
  skip(n: number): void {
    this.pos += n
  }
}

// Rotate so `perspective` lands in slot 0; relative turn order is preserved.
// Slots past players.length stay undefined (zero-padded block).
const rotateOrder = (numPlayers: number, perspective: number): (number | undefined)[] =>
  Array.from({ length: MAX_PLAYERS }, (_, slot) => (slot < numPlayers ? (perspective + slot) % numPlayers : undefined))

const writeTile = (w: Writer, tile: Tile | undefined, isSelf: boolean): void => {
  if (tile === undefined) {
    w.skip(TILE_CH)
    return
  }
  const [land, erection, clergy] = tile
  w.hot(LAND_LEN, land !== undefined ? LANDS.indexOf(land) : -1)
  w.put(erection !== undefined ? erectionId(erection) : 0)
  if (clergy !== undefined) {
    w.buf[w.pos + (isPrior(clergy) ? 1 : 0)] = 1 // [laybrother, prior] presence
    if (!isSelf) w.buf[w.pos + 2] = 1 // opponent-owned
  }
  w.skip(CLERGY_LEN)
}

const clergyBuckets = (t: Tableau, config: GameCommandConfigParams): [number, number, number, number] => {
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
    } else if (placed) {
      lbPlaced++
    } else {
      lbUnplaced++
    }
  }
  return [lbUnplaced, lbPlaced, priorUnplaced, priorPlaced]
}

const writeTableau = (w: Writer, t: Tableau, isSelf: boolean, config: GameCommandConfigParams): void => {
  for (const r of RESOURCES) w.put(t[r] ?? 0)
  w.put(t.wonders)
  for (const v of clergyBuckets(t, config)) w.put(v)
  w.bits(
    SETTLEMENT_HAND_LEN,
    t.settlements.map((s) => settlementHandIndex.get(s) ?? -1)
  )
  for (let outputRow = 0; outputRow < H; outputRow++) {
    const row = t.landscape[outputRow + t.landscapeOffset - ANCHOR]
    for (let c = 0; c < W; c++) writeTile(w, row?.[c], isSelf)
  }
}

const writeFrame = (w: Writer, frame: Frame, order: (number | undefined)[]): void => {
  w.put(frame.round)
  w.hot(SETTLEMENT_ROUNDS.length, SETTLEMENT_ROUNDS.indexOf(frame.settlementRound))
  w.hot(MAX_PLAYERS, order.indexOf(frame.currentPlayerIndex))
  w.hot(MAX_PLAYERS, order.indexOf(frame.activePlayerIndex))
  w.put(frame.mainActionUsed ? 1 : 0)
  w.put(frame.neutralBuildingPhase ? 1 : 0)
  w.put(frame.bonusRoundPlacement ? 1 : 0)
  w.put(frame.canBuyLandscape ? 1 : 0)
  w.bits(
    COMMANDS.length,
    frame.bonusActions.map((c) => COMMANDS.indexOf(c))
  )
  w.hot(NEXT_USES.length, NEXT_USES.indexOf(frame.nextUse))
  w.bits(
    VOCAB_CAPACITY,
    frame.usableBuildings.map((b) => buildingMaskIndex.get(b) ?? -1)
  )
  w.bits(
    VOCAB_CAPACITY,
    frame.unusableBuildings.map((b) => buildingMaskIndex.get(b) ?? -1)
  )
}

const rondelDelta = (rondel: Rondel, key: (typeof RONDEL_KEYS)[number]): number => {
  const slot = rondel[key]
  if (slot === undefined) return 0
  return ((((slot - rondel.pointingBefore) % RONDEL_PERIOD) + RONDEL_PERIOD) % RONDEL_PERIOD) / RONDEL_PERIOD
}
const rondelYield = (rondel: Rondel, key: (typeof RONDEL_KEYS)[number], config: GameCommandConfigParams): number => {
  const slot = rondel[key]
  if (slot === undefined) return 0
  return take(rondel.pointingBefore, slot, config) / MAX_RONDEL_YIELD
}

const writeShared = (w: Writer, state: GameState): void => {
  const rondel = state.rondel!
  const config = state.config!
  for (const key of RONDEL_KEYS) w.put(rondelDelta(rondel, key))
  for (const key of RONDEL_KEYS) w.put(rondelYield(rondel, key, config))
  w.bits(
    VOCAB_CAPACITY,
    state.buildings!.map((b) => buildingMaskIndex.get(b) ?? -1)
  )
  for (let i = 0; i < MAX_PRICE_SLOTS; i++) w.put(state.plotPurchasePrices![i] ?? 0)
  for (let i = 0; i < MAX_PRICE_SLOTS; i++) w.put(state.districtPurchasePrices![i] ?? 0)
  w.put(state.wonders!)
  w.hot(MAX_PLAYERS, config.players - 1)
  w.hot(LENGTHS.length, LENGTHS.indexOf(config.length))
  w.hot(COUNTRY_CAPACITY, COUNTRIES.indexOf(config.country))
}

// Encode straight into a caller-supplied buffer at `offset`, writing exactly
// FEATURE_LEN floats in [offset, offset + FEATURE_LEN). Lets the shard exporter
// pack many states into one big buffer without a per-state allocation.
export const encodeInto = (state: GameState, perspective: number | undefined, out: Float32Array, offset = 0): void => {
  if (out.length < offset + FEATURE_LEN)
    throw new RangeError(`encodeInto: buffer too small (need ${offset + FEATURE_LEN}, have ${out.length})`)
  // The Writer only ever sets 1s (one-hots/masks) and explicit puts; skipped
  // player blocks and one-hot gaps rely on zeroed memory, so a reused scratch
  // buffer must be cleared or stale values leak through.
  out.fill(0, offset, offset + FEATURE_LEN)
  if (state.status === GameStatusEnum.SETUP) return
  const p = perspective ?? state.frame!.currentPlayerIndex
  const order = rotateOrder(state.players!.length, p)
  const w = new Writer(out)
  w.pos = offset
  order.forEach((idx, slot) => {
    if (idx === undefined) w.skip(PLAYER_BLOCK)
    else writeTableau(w, state.players![idx], slot === 0, state.config!)
  })
  writeFrame(w, state.frame!, order)
  writeShared(w, state)
}

export const encode = (state: GameState, perspective?: number): Float32Array => {
  const buf = new Float32Array(FEATURE_LEN)
  encodeInto(state, perspective, buf)
  return buf
}
