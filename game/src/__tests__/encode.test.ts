import { describe, it, expect } from '../testHelpers'
import { PCGState } from 'pcg'
import { encode, featureSpec, FEATURE_LEN } from '../encode'
import {
  BuildingEnum,
  Clergy,
  Frame,
  GameCommandConfigParams,
  GameCommandEnum,
  GameState,
  GameStatusEnum,
  LandEnum,
  NextUseClergy,
  PlayerColor,
  Rondel,
  SettlementEnum,
  SettlementRound,
  Tableau,
  Tile,
} from '../types'

const config: GameCommandConfigParams = { players: 3, length: 'long', country: 'ireland' }

const zeroResources = {
  peat: 0,
  penny: 0,
  clay: 0,
  wood: 0,
  grain: 0,
  sheep: 0,
  stone: 0,
  flour: 0,
  grape: 0,
  nickel: 0,
  malt: 0,
  coal: 0,
  book: 0,
  ceramic: 0,
  whiskey: 0,
  straw: 0,
  meat: 0,
  ornament: 0,
  bread: 0,
  wine: 0,
  beer: 0,
  reliquary: 0,
}

const makeTableau = (color: PlayerColor, overrides: Partial<Tableau> = {}): Tableau => ({
  color,
  clergy: [],
  settlements: [],
  landscape: [[]],
  landscapeOffset: 0,
  wonders: 0,
  ...zeroResources,
  ...overrides,
})

const frame: Frame = {
  next: 1,
  round: 3,
  startingPlayer: 0,
  settlementRound: SettlementRound.A,
  currentPlayerIndex: 1,
  activePlayerIndex: 1,
  neutralBuildingPhase: false,
  bonusRoundPlacement: false,
  mainActionUsed: false,
  bonusActions: [],
  canBuyLandscape: true,
  unusableBuildings: [],
  usableBuildings: [],
  nextUse: NextUseClergy.Any,
}

const rondel: Rondel = {
  pointingBefore: 0,
  wood: 1,
  clay: 2,
  coin: 3,
  joker: 4,
  grain: 5,
  peat: 6,
  sheep: 7,
  grape: 8,
  stone: 9,
}

const baseState: GameState = {
  status: GameStatusEnum.PLAYING,
  config,
  rondel,
  wonders: 8,
  players: [makeTableau(PlayerColor.Red), makeTableau(PlayerColor.Green), makeTableau(PlayerColor.Blue)],
  buildings: [],
  plotPurchasePrices: [7, 6, 5, 4, 3],
  districtPurchasePrices: [6, 5, 4, 3],
  frame,
  randGen: {} as PCGState,
}

// Helpers to locate things using the published featureSpec offsets.
const playerOffset = (slot: number) => featureSpec.offsets.players[slot]
const gridStart = (slot: number) => playerOffset(slot) + featureSpec.offsets.playerGrid
const tileBase = (slot: number, outRow: number, col: number) =>
  gridStart(slot) + (outRow * featureSpec.width + col) * featureSpec.tileChannels
const anchorRowTile = (slot: number, logicalRow: number, col: number) =>
  tileBase(slot, featureSpec.gridAnchor + logicalRow, col)

describe('encode (compact, capacity-256)', () => {
  it('returns a zero vector of FEATURE_LEN for SETUP', () => {
    const setup: GameState = { status: GameStatusEnum.SETUP, randGen: {} as PCGState }
    const vec = encode(setup)
    expect(vec).toBeInstanceOf(Float32Array)
    expect(vec.length).toBe(FEATURE_LEN)
    expect(vec.every((v) => v === 0)).toBe(true)
  })

  it('produces a vector of FEATURE_LEN for a PLAYING state', () => {
    expect(encode(baseState).length).toBe(FEATURE_LEN)
  })

  it('is much smaller than the old dense one-hot layout', () => {
    // sanity: the redesign must stay well under the old 167k-float vector
    expect(FEATURE_LEN).toBeLessThan(20000)
  })

  it('reserves capacity 256 so the vector shape is stable as buildings grow', () => {
    expect(featureSpec.vocabCapacity).toBe(256)
    expect(featureSpec.vocab.erections.length).toBeLessThan(featureSpec.vocabCapacity)
  })

  it('writes resource counts at the start of the perspective player block', () => {
    const players = [
      makeTableau(PlayerColor.Red, { wood: 5, clay: 3 }),
      makeTableau(PlayerColor.Green),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)
    const base = playerOffset(0) + featureSpec.offsets.playerResources
    expect(vec[base + featureSpec.vocab.resources.indexOf('wood')]).toBe(5)
    expect(vec[base + featureSpec.vocab.resources.indexOf('clay')]).toBe(3)
  })

  it('rotates players so that perspective sits in slot 0', () => {
    const players = [
      makeTableau(PlayerColor.Red, { wood: 1 }),
      makeTableau(PlayerColor.Green, { wood: 2 }),
      makeTableau(PlayerColor.Blue, { wood: 3 }),
    ]
    const vec = encode({ ...baseState, players }, 1)
    const woodIdx = featureSpec.vocab.resources.indexOf('wood')
    expect(vec[playerOffset(0) + featureSpec.offsets.playerResources + woodIdx]).toBe(2)
    expect(vec[playerOffset(1) + featureSpec.offsets.playerResources + woodIdx]).toBe(3)
    expect(vec[playerOffset(2) + featureSpec.offsets.playerResources + woodIdx]).toBe(1)
    expect(vec[playerOffset(3) + featureSpec.offsets.playerResources + woodIdx]).toBe(0)
  })

  it('encodes a tile with land one-hot, erection id, and clergy bits', () => {
    const tile: Tile = [LandEnum.Hillside, BuildingEnum.ClayMoundR, Clergy.LayBrother1R]
    const landscape: Tile[][] = [[[], [], [], [], [], [], tile, [], []], [[]]]
    const players = [
      makeTableau(PlayerColor.Red, { landscape, clergy: [Clergy.PriorR] }),
      makeTableau(PlayerColor.Green),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)
    const cell = anchorRowTile(0, 0, 6) // landscapeOffset 0 -> logical row 0 -> anchor; col 6

    // land one-hot
    expect(vec[cell + featureSpec.vocab.lands.indexOf(LandEnum.Hillside)]).toBe(1)
    // erection id is the color-agnostic ClayMound type (id = vocab index + 1)
    const expectedId = featureSpec.vocab.erections.indexOf('ClayMound') + 1
    expect(vec[cell + featureSpec.tile.erectionIdChannel]).toBe(expectedId)
    expect(expectedId).toBeGreaterThanOrEqual(1)
    // clergy: laybrother present (channel 0), not opponent-owned (channel 2)
    const clBase = cell + featureSpec.tile.clergyOffset
    expect(vec[clBase + 0]).toBe(1)
    expect(vec[clBase + 1]).toBe(0)
    expect(vec[clBase + 2]).toBe(0)
  })

  it('color-collapses: ClayMoundR and ClayMoundG map to the same erection id', () => {
    const mk = (b: BuildingEnum, color: PlayerColor): GameState => {
      const tile: Tile = [LandEnum.Hillside, b]
      return {
        ...baseState,
        players: [
          makeTableau(color, { landscape: [[tile]] }),
          makeTableau(PlayerColor.Green),
          makeTableau(PlayerColor.Blue),
        ],
      }
    }
    const idR = encode(mk(BuildingEnum.ClayMoundR, PlayerColor.Red), 0)[
      anchorRowTile(0, 0, 0) + featureSpec.tile.erectionIdChannel
    ]
    const idG = encode(mk(BuildingEnum.ClayMoundG, PlayerColor.Green), 0)[
      anchorRowTile(0, 0, 0) + featureSpec.tile.erectionIdChannel
    ]
    expect(idR).toBe(idG)
    expect(idR).toBeGreaterThanOrEqual(1)
  })

  it('keeps country variants distinct (F03 != I03)', () => {
    expect(featureSpec.vocab.erections.includes(BuildingEnum.GrainStorage)).toBe(true) // F03
    expect(featureSpec.vocab.erections.includes(BuildingEnum.Granary)).toBe(true) // I03
  })

  it('marks opponent-owned clergy on the opponent channel', () => {
    const tile: Tile = [LandEnum.Plains, BuildingEnum.FarmYardG, Clergy.PriorG]
    const players = [
      makeTableau(PlayerColor.Red),
      makeTableau(PlayerColor.Green, { landscape: [[tile]] }),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)
    const clBase = anchorRowTile(1, 0, 0) + featureSpec.tile.clergyOffset
    expect(vec[clBase + 1]).toBe(1) // prior
    expect(vec[clBase + 2]).toBe(1) // opponent flag
  })

  it('encodes settlement tiles via the unified erection id', () => {
    const tile: Tile = [LandEnum.Plains, SettlementEnum.ShantyTownR]
    const players = [
      makeTableau(PlayerColor.Red, { landscape: [[tile]] }),
      makeTableau(PlayerColor.Green),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)
    const id = vec[anchorRowTile(0, 0, 0) + featureSpec.tile.erectionIdChannel]
    // settlements sort after buildings: id = buildings.length + settlementType + 1
    expect(id).toBeGreaterThanOrEqual(featureSpec.vocab.buildings.length + 1)
  })

  it('encodes in-hand settlements as color-collapsed types', () => {
    const players = [
      makeTableau(PlayerColor.Red, { settlements: [SettlementEnum.ShantyTownR, SettlementEnum.HamletR] }),
      makeTableau(PlayerColor.Green),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)
    const base = playerOffset(0) + featureSpec.offsets.playerSettlements
    const setCount = vec.slice(base, base + featureSpec.vocab.settlements.length).reduce((a, b) => a + b, 0)
    expect(setCount).toBe(2)
  })

  it('anchors the landscape grid by landscapeOffset', () => {
    const tile: Tile = [LandEnum.Hillside, BuildingEnum.ClayMoundR]
    const landscapeA: Tile[][] = [[tile], []]
    const landscapeB: Tile[][] = [[], [], [tile], []]
    const vecA = encode(
      {
        ...baseState,
        players: [
          makeTableau(PlayerColor.Red, { landscape: landscapeA, landscapeOffset: 0 }),
          makeTableau(PlayerColor.Green),
          makeTableau(PlayerColor.Blue),
        ],
      },
      0
    )
    const vecB = encode(
      {
        ...baseState,
        players: [
          makeTableau(PlayerColor.Red, { landscape: landscapeB, landscapeOffset: 2 }),
          makeTableau(PlayerColor.Green),
          makeTableau(PlayerColor.Blue),
        ],
      },
      0
    )
    const start = playerOffset(0)
    const end = playerOffset(1)
    expect(vecA.slice(start, end)).toStrictEqual(vecB.slice(start, end))
  })

  it('counts unplaced laybrothers in the clergy bucket', () => {
    const players = [
      makeTableau(PlayerColor.Red, { clergy: [Clergy.LayBrother1R, Clergy.LayBrother2R, Clergy.PriorR] }),
      makeTableau(PlayerColor.Green),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)
    const base = playerOffset(0) + featureSpec.offsets.playerClergy
    expect(vec[base + 0]).toBe(2) // lbUnplaced
    expect(vec[base + 1]).toBe(0) // lbPlaced
    expect(vec[base + 2]).toBe(1) // priorUnplaced
    expect(vec[base + 3]).toBe(0) // priorPlaced
  })

  it('encodes the bonusActions bitmask in the frame block', () => {
    const stateWithBonus: GameState = {
      ...baseState,
      frame: { ...frame, bonusActions: [GameCommandEnum.BUILD, GameCommandEnum.SETTLE] },
    }
    const vec = encode(stateWithBonus)
    const bonusOffset =
      featureSpec.offsets.frame + 1 + featureSpec.vocab.settlementRounds.length + featureSpec.maxPlayers * 2 + 4
    expect(vec[bonusOffset + featureSpec.vocab.commands.indexOf(GameCommandEnum.BUILD)]).toBe(1)
    expect(vec[bonusOffset + featureSpec.vocab.commands.indexOf(GameCommandEnum.SETTLE)]).toBe(1)
    expect(vec[bonusOffset + featureSpec.vocab.commands.indexOf(GameCommandEnum.CUT_PEAT)]).toBe(0)
  })

  it('encodes the yield each rondel token would give if taken now', () => {
    const stateAtFour: GameState = { ...baseState, rondel: { ...rondel, pointingBefore: 4, wood: 1, clay: 4 } }
    const vec = encode(stateAtFour)
    const yieldsOffset = featureSpec.offsets.shared + featureSpec.vocab.rondelKeys.length
    expect(vec[yieldsOffset + featureSpec.vocab.rondelKeys.indexOf('wood')]).toBeCloseTo(4 / 10)
    expect(vec[yieldsOffset + featureSpec.vocab.rondelKeys.indexOf('clay')]).toBe(0)
  })

  it('yields 0 for rondel tokens not yet on the rondel', () => {
    const stateNoGrape: GameState = {
      ...baseState,
      rondel: { pointingBefore: 5, wood: 0, clay: 0, coin: 0, grain: 0, peat: 0, sheep: 0 },
    }
    const vec = encode(stateNoGrape)
    const yieldsOffset = featureSpec.offsets.shared + featureSpec.vocab.rondelKeys.length
    expect(vec[yieldsOffset + featureSpec.vocab.rondelKeys.indexOf('grape')]).toBe(0)
    expect(vec[yieldsOffset + featureSpec.vocab.rondelKeys.indexOf('stone')]).toBe(0)
    expect(vec[yieldsOffset + featureSpec.vocab.rondelKeys.indexOf('joker')]).toBe(0)
  })

  it('sets the still-available buildings mask in the shared block', () => {
    const state: GameState = { ...baseState, buildings: [BuildingEnum.Priory, BuildingEnum.Bakery] }
    const vec = encode(state)
    const availOffset = featureSpec.offsets.shared + featureSpec.vocab.rondelKeys.length * 2
    const idPriory = featureSpec.vocab.buildings.indexOf(BuildingEnum.Priory)
    const idBakery = featureSpec.vocab.buildings.indexOf(BuildingEnum.Bakery)
    expect(vec[availOffset + idPriory]).toBe(1)
    expect(vec[availOffset + idBakery]).toBe(1)
  })
})
