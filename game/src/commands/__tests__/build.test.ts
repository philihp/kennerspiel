import { initialState } from '../../state'
import {
  BuildingEnum,
  GameStatePlaying,
  GameStatusEnum,
  LandEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { build } from '../build'

describe('commands/build', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 0,
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
    hops: 0,
    coal: 0,
    book: 0,
    pottery: 0,
    whiskey: 0,
    straw: 0,
    meat: 0,
    ornament: 0,
    bread: 0,
    wine: 0,
    beer: 0,
    reliquary: 0,
  }
  const s0: GameStatePlaying = {
    ...initialState,
    status: GameStatusEnum.PLAYING,
    frame: {
      next: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
      workContractCost: 1,
      currentPlayerIndex: 0,
      activePlayerIndex: 0,
      neutralBuildingPhase: false,
      bonusRoundPlacement: false,
      mainActionUsed: false,
      bonusActions: [],
      canBuyLandscape: true,
      unusableBuildings: [],
      usableBuildings: [],
      nextUse: NextUseClergy.Any,
    },
    config: {
      country: 'france',
      players: 3,
      length: 'long',
    },
    rondel: {
      pointingBefore: 3,
      stone: 1,
      joker: 2,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('build', () => {
    it('fails when building is not available', () => {
      const s3: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          activePlayerIndex: 0,
        },
        players: [
          {
            ...s0.players[0],
            wood: 10,
            penny: 10,
            clay: 10,
          },
          ...s0.players.slice(1),
        ],
        buildings: s0.buildings.filter((b) => b !== 'G07'),
      }
      const s4 = build({ row: 1, col: 3, building: BuildingEnum.Calefactory })(s3)!
      expect(s4).toBeUndefined()
    })
    it('fails when erection present', () => {
      const s3: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          activePlayerIndex: 0,
        },
        players: [
          {
            ...s0.players[0],
            wood: 10,
            penny: 10,
            clay: 10,
          },
          ...s0.players.slice(1),
        ],
        buildings: [BuildingEnum.Calefactory],
      }
      const s4 = build({ row: 1, col: 0, building: BuildingEnum.Calefactory })(s3)!
      expect(s4).toBeUndefined()
    })
    it('fails when player cant afford building', () => {
      const s3: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          activePlayerIndex: 0,
        },
        players: [
          {
            ...s0.players[0],
            wood: 0,
            penny: 0,
            clay: 0,
            stone: 0,
            straw: 0,
          },
          ...s0.players.slice(1),
        ],
        buildings: [BuildingEnum.PeatCoalKiln],
      }
      const s4 = build({ row: 1, col: 3, building: BuildingEnum.PeatCoalKiln })(s3)!
      expect(s4).toBeUndefined()
    })
    it('fails if building cloister without being neighbors to another', () => {
      const s3: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          activePlayerIndex: 0,
        },
        players: [
          {
            ...s0.players[0],
            wood: 10,
            penny: 10,
            clay: 10,
            stone: 10,
          },
          ...s0.players.slice(1),
        ],
        buildings: [BuildingEnum.Priory],
      }
      const s4 = build({ row: 0, col: 3, building: BuildingEnum.Priory })(s3)!
      expect(s4).toBeUndefined()
    })
    it('builds just fine', () => {
      const s3: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          activePlayerIndex: 0,
        },
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
              [['W'], ['C'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
            ] as Tile[][],
            wood: 10,
            penny: 10,
            clay: 10,
            stone: 10,
            straw: 10,
          },
          ...s0.players.slice(1),
        ],
        buildings: [BuildingEnum.Windmill],
      }
      const s4 = build({ row: 1, col: -1, building: BuildingEnum.Windmill })(s3)!
      expect(s4).toBeDefined()
      expect(s4.buildings).not.toContain(BuildingEnum.Windmill)
      expect(s4.players[0]).toMatchObject({
        wood: 7,
        clay: 8,
        stone: 10,
        straw: 10,
        landscape: [
          [['W'], ['C'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
          [['W'], ['C', 'F04'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        ],
      })
    })
    it('accounts for landscape Y offset', () => {
      const s3: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          activePlayerIndex: 0,
        },
        players: [
          {
            ...s0.players[0],
            wood: 10,
            penny: 10,
            clay: 10,
            stone: 10,
            straw: 10,
            landscapeOffset: 1,
            landscape: [
              [[], [], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [], []],
              [[], [], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [], []],
              [[], [], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [], []],
            ],
          },
          ...s0.players.slice(1),
        ],
        buildings: [BuildingEnum.GrainStorage],
      }
      const s4 = build({ row: -1, col: 1, building: BuildingEnum.GrainStorage })(s3)!
      expect(s4).toBeDefined()
      expect(s4.buildings).not.toContain(BuildingEnum.GrainStorage)
      expect(s4.players[0]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P', 'F03'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P'], [], []],
        ],
      })
    })
  })
})
