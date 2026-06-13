import { describe, it, expect } from '../testHelpers'
import { PCGState } from 'pcg'
import { encode, featureSpec, FEATURE_LEN } from '../encode'
import {
  BuildingEnum,
  Clergy,
  Frame,
  GameCommandConfigParams,
  GameCommandEnum,
  GameStatePlaying,
  GameStateSetup,
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

const baseState: GameStatePlaying = {
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

describe('encode', () => {
  it('returns a zero vector of FEATURE_LEN for SETUP', () => {
    const setup: GameStateSetup = {
      status: GameStatusEnum.SETUP,
      randGen: {} as PCGState,
    }
    const vec = encode(setup)
    expect(vec).toBeInstanceOf(Float32Array)
    expect(vec.length).toBe(FEATURE_LEN)
    expect(vec.every((v) => v === 0)).toBe(true)
  })

  it('produces a vector of FEATURE_LEN for a PLAYING state', () => {
    const vec = encode(baseState)
    expect(vec.length).toBe(FEATURE_LEN)
  })

  it('writes resource counts at the start of the perspective player block', () => {
    const players = [
      makeTableau(PlayerColor.Red, { wood: 5, clay: 3 }),
      makeTableau(PlayerColor.Green),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)
    const woodIdx = featureSpec.vocab.resources.indexOf('wood')
    const clayIdx = featureSpec.vocab.resources.indexOf('clay')
    expect(vec[woodIdx]).toBe(5)
    expect(vec[clayIdx]).toBe(3)
  })

  it('rotates players so that perspective sits in slot 0', () => {
    const players = [
      makeTableau(PlayerColor.Red, { wood: 1 }),
      makeTableau(PlayerColor.Green, { wood: 2 }),
      makeTableau(PlayerColor.Blue, { wood: 3 }),
    ]
    const vec = encode({ ...baseState, players }, 1)
    const woodIdx = featureSpec.vocab.resources.indexOf('wood')
    const slotOffsets = featureSpec.offsets.players
    expect(vec[slotOffsets[0] + woodIdx]).toBe(2)
    expect(vec[slotOffsets[1] + woodIdx]).toBe(3)
    expect(vec[slotOffsets[2] + woodIdx]).toBe(1)
    expect(vec[slotOffsets[3] + woodIdx]).toBe(0)
  })

  it('encodes a landscape tile with land, building, and clergy bits', () => {
    const tile: Tile = [LandEnum.Hillside, BuildingEnum.ClayMoundR, Clergy.LayBrother1R]
    const landscape: Tile[][] = [[[], [], [], [], [], [], tile, [], []], [[]]]
    const players = [
      makeTableau(PlayerColor.Red, { landscape, clergy: [Clergy.PriorR] }),
      makeTableau(PlayerColor.Green),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)

    const settlementsLen = featureSpec.vocab.settlements.length
    const gridStart =
      featureSpec.offsets.players[0] +
      featureSpec.vocab.resources.length +
      1 + // wonders
      4 + // clergy buckets
      settlementsLen

    // landscapeOffset is 0, so raw row 0 → logical row 0 → output row ANCHOR
    const cellBase = gridStart + (featureSpec.gridAnchor * featureSpec.width + 6) * featureSpec.tileChannels
    const landCh = featureSpec.vocab.lands.length
    const erectCh = featureSpec.vocab.buildings.length + featureSpec.vocab.settlements.length

    expect(vec[cellBase + featureSpec.vocab.lands.indexOf(LandEnum.Hillside)]).toBe(1)
    expect(vec[cellBase + landCh + featureSpec.vocab.buildings.indexOf(BuildingEnum.ClayMoundR)]).toBe(1)
    // laybrother is channel 0 in the clergy block; not opponent-owned for self
    expect(vec[cellBase + landCh + erectCh + 0]).toBe(1)
    expect(vec[cellBase + landCh + erectCh + 2]).toBe(0)
  })

  it('marks opponent-owned clergy on the opponent-channel', () => {
    const tile: Tile = [LandEnum.Plains, BuildingEnum.FarmYardG, Clergy.PriorG]
    const opponentLandscape: Tile[][] = [[tile]]
    const players = [
      makeTableau(PlayerColor.Red),
      makeTableau(PlayerColor.Green, { landscape: opponentLandscape }),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)

    const settlementsLen = featureSpec.vocab.settlements.length
    const gridStart = featureSpec.offsets.players[1] + featureSpec.vocab.resources.length + 1 + 4 + settlementsLen

    const cellBase = gridStart + (featureSpec.gridAnchor * featureSpec.width + 0) * featureSpec.tileChannels
    const landCh = featureSpec.vocab.lands.length
    const erectCh = featureSpec.vocab.buildings.length + featureSpec.vocab.settlements.length
    expect(vec[cellBase + landCh + erectCh + 1]).toBe(1) // prior
    expect(vec[cellBase + landCh + erectCh + 2]).toBe(1) // opponent flag
  })

  it('encodes the bonusActions bitmask in the frame block', () => {
    const stateWithBonus: GameStatePlaying = {
      ...baseState,
      frame: { ...frame, bonusActions: [GameCommandEnum.BUILD, GameCommandEnum.SETTLE] },
    }
    const vec = encode(stateWithBonus)
    const frameStart = featureSpec.offsets.frame
    const bonusOffset =
      frameStart +
      1 + // round
      featureSpec.vocab.settlementRounds.length +
      featureSpec.maxPlayers * 2 +
      4
    const buildIdx = featureSpec.vocab.commands.indexOf(GameCommandEnum.BUILD)
    const settleIdx = featureSpec.vocab.commands.indexOf(GameCommandEnum.SETTLE)
    const cutPeatIdx = featureSpec.vocab.commands.indexOf(GameCommandEnum.CUT_PEAT)
    expect(vec[bonusOffset + buildIdx]).toBe(1)
    expect(vec[bonusOffset + settleIdx]).toBe(1)
    expect(vec[bonusOffset + cutPeatIdx]).toBe(0)
  })

  it('encodes settlement tiles in the erection channel block', () => {
    const tile: Tile = [LandEnum.Plains, SettlementEnum.ShantyTownR]
    const landscape: Tile[][] = [[tile]]
    const players = [
      makeTableau(PlayerColor.Red, { landscape }),
      makeTableau(PlayerColor.Green),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)

    const settlementsLen = featureSpec.vocab.settlements.length
    const gridStart = featureSpec.offsets.players[0] + featureSpec.vocab.resources.length + 1 + 4 + settlementsLen
    const cellBase = gridStart + (featureSpec.gridAnchor * featureSpec.width + 0) * featureSpec.tileChannels
    const landCh = featureSpec.vocab.lands.length
    const settlementSlot =
      landCh + featureSpec.vocab.buildings.length + featureSpec.vocab.settlements.indexOf(SettlementEnum.ShantyTownR)
    expect(vec[cellBase + settlementSlot]).toBe(1)
  })

  it('anchors the landscape grid by landscapeOffset', () => {
    const tile: Tile = [LandEnum.Hillside, BuildingEnum.ClayMoundR]
    // Player A: starting board at raw rows 0-1, offset 0. ClayMound at raw row 0.
    const landscapeA: Tile[][] = [[tile], []]
    // Player B: same logical board but with 2 rows added above. Raw row 2 is
    // logical row 0; offset = 2. ClayMound at raw row 2.
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
    // The ClayMound cell in both encodings must land at the same output row
    // (gridAnchor), so the per-player slice should match.
    const start = featureSpec.offsets.players[0]
    const end = start + (featureSpec.featureLen - featureSpec.offsets.players[0]) // not strict, but compare grid bytes
    const sliceA = vecA.slice(start, end)
    const sliceB = vecB.slice(start, end)
    expect(sliceA).toStrictEqual(sliceB)
  })

  it('counts unplaced laybrothers in the clergy bucket', () => {
    const players = [
      makeTableau(PlayerColor.Red, { clergy: [Clergy.LayBrother1R, Clergy.LayBrother2R, Clergy.PriorR] }),
      makeTableau(PlayerColor.Green),
      makeTableau(PlayerColor.Blue),
    ]
    const vec = encode({ ...baseState, players }, 0)
    const clergyOffset = featureSpec.offsets.players[0] + featureSpec.vocab.resources.length + 1
    expect(vec[clergyOffset + 0]).toBe(2) // lbUnplaced
    expect(vec[clergyOffset + 1]).toBe(0) // lbPlaced
    expect(vec[clergyOffset + 2]).toBe(1) // priorUnplaced
    expect(vec[clergyOffset + 3]).toBe(0) // priorPlaced
  })

  it('encodes the yield each rondel token would give if taken now', () => {
    // 3p long config uses armValues = [0, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10]
    // take(armIndex, tokenIndex) = armVals[(armIndex - tokenIndex + 13) % 13]
    // With pointingBefore=4 and wood at slot 1: (4-1+13)%13 = 3 → armVals[3] = 4
    // With wood at slot 4 (same as arm): (4-4+13)%13 = 0 → armVals[0] = 0
    const stateAtFour: GameStatePlaying = {
      ...baseState,
      rondel: { ...rondel, pointingBefore: 4, wood: 1, clay: 4 },
    }
    const vec = encode(stateAtFour)
    const yieldsOffset = featureSpec.offsets.shared + featureSpec.vocab.rondelKeys.length
    const woodIdx = featureSpec.vocab.rondelKeys.indexOf('wood')
    const clayIdx = featureSpec.vocab.rondelKeys.indexOf('clay')
    expect(vec[yieldsOffset + woodIdx]).toBeCloseTo(4 / 10)
    expect(vec[yieldsOffset + clayIdx]).toBe(0)
  })

  it('yields 0 for rondel tokens not yet on the rondel', () => {
    const stateNoGrape: GameStatePlaying = {
      ...baseState,
      rondel: { pointingBefore: 5, wood: 0, clay: 0, coin: 0, grain: 0, peat: 0, sheep: 0 },
    }
    const vec = encode(stateNoGrape)
    const yieldsOffset = featureSpec.offsets.shared + featureSpec.vocab.rondelKeys.length
    const grapeIdx = featureSpec.vocab.rondelKeys.indexOf('grape')
    const stoneIdx = featureSpec.vocab.rondelKeys.indexOf('stone')
    const jokerIdx = featureSpec.vocab.rondelKeys.indexOf('joker')
    expect(vec[yieldsOffset + grapeIdx]).toBe(0)
    expect(vec[yieldsOffset + stoneIdx]).toBe(0)
    expect(vec[yieldsOffset + jokerIdx]).toBe(0)
  })
})
