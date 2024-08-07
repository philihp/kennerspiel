import { initialState } from '../../state'
import {
  BuildingEnum,
  GameCommandEnum,
  GameStatePlaying,
  GameStatusEnum,
  LandEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { build, complete } from '../build'

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
  const s0: GameStatePlaying = {
    ...initialState,
    status: GameStatusEnum.PLAYING,
    frame: {
      round: 1,
      next: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
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
        buildings: s0.buildings.filter((b) => b !== ('G07' as BuildingEnum)),
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
    it('fails when building off-board', () => {
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
              [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
              [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
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
    it('automatically converts grain into straw', () => {
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
            wood: 3, // consume 2
            penny: 0,
            clay: 0,
            stone: 0,
            straw: 1, // consume all
            grain: 1, // convert to straw and consume
            flour: 0,
          },
          ...s0.players.slice(1),
        ],
        buildings: [BuildingEnum.Inn],
      }
      const s4 = build({ row: 1, col: -1, building: BuildingEnum.Inn })(s3)!
      expect(s4).toBeDefined()
      expect(s4.buildings).not.toContain(BuildingEnum.Windmill)
      expect(s4.players[0]).toMatchObject({
        wood: 1,
        penny: 0,
        clay: 0,
        stone: 0,
        straw: 0,
        grain: 0,
        flour: 0,
        landscape: [
          [['W'], ['C'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
          [['W'], ['C', 'F20'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
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

    describe('neutralBuildingPhase', () => {
      it('allows building without any resources in neutral building phase', () => {
        const s1 = {
          ...s0,
          players: [
            {
              ...s0.players[0],
              color: PlayerColor.Red,
              landscape: [
                [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LR1'], [], []],
                [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
              ] as Tile[][],
              wood: 0,
              clay: 0,
              stone: 0,
              straw: 0,
              penny: 0,
              nickel: 0,
            },
            {
              ...s0.players[0],
              color: PlayerColor.White,
              landscape: [
                [[], [], ['P', 'G13'], ['P'], ['P'], ['P'], ['P', 'LW1'], [], []],
                [[], [], ['P'], ['P'], ['P', 'LW2'], ['P', 'G01'], ['P', 'LW3'], [], []],
              ] as Tile[][],
              wood: 0,
              clay: 0,
              stone: 0,
              straw: 0,
              penny: 0,
              nickel: 0,
            },
            ...s0.players.slice(1),
          ],
          buildings: [BuildingEnum.Windmill, BuildingEnum.Bakery],
          frame: {
            ...s0.frame,
            activePlayerIndex: 0,
            neutralBuildingPhase: true,
            mainActionUsed: true,
            bonusActions: [GameCommandEnum.BUILD],
            usableBuildings: [BuildingEnum.Priory],
          },
        }
        const s2 = build({ row: 1, col: 1, building: BuildingEnum.Windmill })(s1)!
        expect(s2).toBeDefined()
        expect(s2.buildings).not.toContain(BuildingEnum.Windmill)
        expect(s2.buildings).toContain(BuildingEnum.Bakery)
        expect(s2.players[0]).toMatchObject({
          wood: 0,
          clay: 0,
          stone: 0,
          straw: 0,
          penny: 0,
          nickel: 0,
          landscape: [
            [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LR1'], [], []],
            [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          ],
        })
        expect(s2.players[1]).toMatchObject({
          wood: 0,
          clay: 0,
          stone: 0,
          straw: 0,
          penny: 0,
          nickel: 0,
          landscape: [
            [[], [], ['P', 'G13'], ['P'], ['P'], ['P'], ['P', 'LW1'], [], []],
            [[], [], ['P'], ['P', 'F04'], ['P', 'LW2'], ['P', 'G01'], ['P', 'LW3'], [], []],
          ],
        })
        expect(s2.frame).toMatchObject({
          activePlayerIndex: 0,
          neutralBuildingPhase: true,
          mainActionUsed: true,
          bonusActions: [GameCommandEnum.BUILD],
          usableBuildings: [BuildingEnum.Priory, BuildingEnum.Windmill],
        })
      })

      it('does not allow overbuilding a cloister with a non-cloister', () => {
        const s1 = {
          ...s0,
          players: [
            {
              ...s0.players[0],
              color: PlayerColor.Red,
              landscape: [
                [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LR1'], [], []],
                [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
              ] as Tile[][],
              wood: 0,
              clay: 0,
              stone: 0,
              straw: 0,
              penny: 0,
              nickel: 0,
            },
            {
              ...s0.players[0],
              color: PlayerColor.White,
              landscape: [
                [[], [], ['P', 'G13'], ['P'], ['P'], ['P'], ['P', 'LW1'], [], []],
                [[], [], ['P'], ['P', 'F04'], ['P', 'LW2'], ['P', 'G01'], ['P', 'LW3'], [], []],
              ] as Tile[][],
              wood: 0,
              clay: 0,
              stone: 0,
              straw: 0,
              penny: 0,
              nickel: 0,
            },
            ...s0.players.slice(1),
          ],
          buildings: [BuildingEnum.Bakery],
          frame: {
            ...s0.frame,
            activePlayerIndex: 0,
            neutralBuildingPhase: true,
            mainActionUsed: true,
            nextUse: NextUseClergy.OnlyPrior,
            bonusActions: [GameCommandEnum.BUILD],
            usableBuildings: [BuildingEnum.Bakery, BuildingEnum.Windmill],
          },
        }
        const s2 = build({ row: 1, col: 4, building: BuildingEnum.Bakery })(s1)!
        expect(s2).toBeUndefined()
      })

      it('does not allow overbuilding a non-cloister with a cloister', () => {
        const s1 = {
          ...s0,
          players: [
            {
              ...s0.players[0],
              color: PlayerColor.Red,
              landscape: [
                [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LR1'], [], []],
                [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
              ] as Tile[][],
              wood: 0,
              clay: 0,
              stone: 0,
              straw: 0,
              penny: 0,
              nickel: 0,
            },
            {
              ...s0.players[0],
              color: PlayerColor.White,
              landscape: [
                [[], [], ['P', 'G13'], ['P'], ['P'], ['P'], ['P', 'LW1'], [], []],
                [[], [], ['P'], ['P', 'F04'], ['P', 'LW2'], ['P', 'F05'], ['P', 'LW3'], [], []],
              ] as Tile[][],
              wood: 0,
              clay: 0,
              stone: 0,
              straw: 0,
              penny: 0,
              nickel: 0,
            },
            ...s0.players.slice(1),
          ],
          buildings: [BuildingEnum.Bakery],
          frame: {
            ...s0.frame,
            activePlayerIndex: 0,
            neutralBuildingPhase: true,
            mainActionUsed: true,
            nextUse: NextUseClergy.OnlyPrior,
            bonusActions: [GameCommandEnum.BUILD],
            usableBuildings: [BuildingEnum.Priory, BuildingEnum.Windmill],
          },
        }
        const s2 = build({ row: 1, col: 3, building: BuildingEnum.Priory })(s1)!
        expect(s2).toBeUndefined()
      })

      it('allows overbuilding a newly-built building', () => {
        const s1 = {
          ...s0,
          players: [
            {
              ...s0.players[0],
              color: PlayerColor.Red,
              landscape: [
                [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LR1'], [], []],
                [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
              ] as Tile[][],
              wood: 0,
              clay: 0,
              stone: 0,
              straw: 0,
              penny: 0,
              nickel: 0,
            },
            {
              ...s0.players[0],
              color: PlayerColor.White,
              landscape: [
                [[], [], ['P', 'G13'], ['P'], ['P'], ['P'], ['P', 'LW1'], [], []],
                [[], [], ['P'], ['P', 'F04'], ['P', 'LW2'], ['P', 'G01'], ['P', 'LW3'], [], []],
              ] as Tile[][],
              wood: 0,
              clay: 0,
              stone: 0,
              straw: 0,
              penny: 0,
              nickel: 0,
            },
            ...s0.players.slice(1),
          ],
          buildings: [BuildingEnum.Bakery],
          frame: {
            ...s0.frame,
            activePlayerIndex: 0,
            neutralBuildingPhase: true,
            mainActionUsed: true,
            nextUse: NextUseClergy.OnlyPrior,
            bonusActions: [GameCommandEnum.BUILD],
            usableBuildings: [BuildingEnum.Priory, BuildingEnum.Windmill],
          },
        }
        const s2 = build({ row: 1, col: 1, building: BuildingEnum.Bakery })(s1)!
        expect(s2).toBeDefined()
        expect(s2.buildings).toStrictEqual([])
        expect(s2.players[0]).toMatchObject({
          wood: 0,
          clay: 0,
          stone: 0,
          straw: 0,
          penny: 0,
          nickel: 0,
          landscape: [
            [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LR1'], [], []],
            [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          ],
        })
        expect(s2.players[1]).toMatchObject({
          wood: 0,
          clay: 0,
          stone: 0,
          straw: 0,
          penny: 0,
          nickel: 0,
          landscape: [
            [[], [], ['P', 'G13'], ['P'], ['P'], ['P'], ['P', 'LW1'], [], []],
            [[], [], ['P'], ['P', 'F05'], ['P', 'LW2'], ['P', 'G01'], ['P', 'LW3'], [], []],
          ],
        })
        expect(s2.frame).toMatchObject({
          activePlayerIndex: 0,
          neutralBuildingPhase: true,
          mainActionUsed: true,
          bonusActions: [GameCommandEnum.SETTLE, GameCommandEnum.COMMIT],
          nextUse: NextUseClergy.OnlyPrior,
          usableBuildings: ['G01', 'F05'],
        })
      })
    })
  })

  describe('complete', () => {
    it('allows running if BUILD is in bonus acitons', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [GameCommandEnum.BUILD],
        },
        players: [
          {
            ...s0.players[0],
            wood: 25,
            clay: 25,
            stone: 25,
            penny: 25,
            straw: 25,
          },
          ...s0.players.slice(1),
        ],
        buildings: [BuildingEnum.Priory, BuildingEnum.CloisterCourtyard],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['BUILD'])
    })
    it('allows running if main action not used yet', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: false,
          bonusActions: [],
        },
        players: [
          {
            ...s0.players[0],
            wood: 25,
            clay: 25,
            stone: 25,
            penny: 25,
            straw: 25,
          },
          ...s0.players.slice(1),
        ],
        buildings: [BuildingEnum.Priory, BuildingEnum.CloisterCourtyard],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['BUILD'])
    })
    it('disallows running if no buildings are buildable', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: false,
          bonusActions: [],
        },
        buildings: [],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('allows running if buildings are buildable', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: false,
          bonusActions: [],
        },
        players: [
          {
            ...s0.players[0],
            wood: 25,
            clay: 25,
            stone: 25,
            penny: 25,
            straw: 25,
          },
          ...s0.players.slice(1),
        ],
        buildings: [BuildingEnum.Priory, BuildingEnum.CloisterCourtyard],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['BUILD'])
    })
    it('does not allow running if not not permitted by frame', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('gives all the buildings which may be built', () => {
      const s1: GameStatePlaying = {
        ...s0,
        buildings: [
          BuildingEnum.Priory, // WoCl
          BuildingEnum.CloisterCourtyard, // WoWo
          BuildingEnum.GrainStorage, // WoSw
          BuildingEnum.Windmill, // WoWoWoClCl
          BuildingEnum.Bakery, // ClClSw
          BuildingEnum.FuelMerchant, // ClSw
          BuildingEnum.PeatCoalKiln, // Cl
          BuildingEnum.Market, // SnSn
          BuildingEnum.CloisterGarden, // PnPnPn
          BuildingEnum.Carpentry, // WoWoCl
          BuildingEnum.HarborPromenade, // WoSn - coast only, should we catch this?
          BuildingEnum.StoneMerchant, // Wo
          BuildingEnum.BuildersMarket, // ClCl
        ],
        players: [
          {
            ...s0.players[0],
            wood: 1,
            clay: 1,
            straw: 1,
            stone: 1,
            penny: 2,
            wine: 1,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)(['BUILD'])
      expect(c0).toStrictEqual([
        BuildingEnum.Priory,
        BuildingEnum.GrainStorage,
        BuildingEnum.FuelMerchant,
        BuildingEnum.PeatCoalKiln,
        BuildingEnum.CloisterGarden,
        BuildingEnum.HarborPromenade,
        BuildingEnum.StoneMerchant,
        // notice no noop here
      ])
    })

    it('suggests buildings which require autoconversion of grain', () => {
      const s1: GameStatePlaying = {
        ...s0,
        buildings: [
          BuildingEnum.Priory, // WoCl
          BuildingEnum.FuelMerchant, // ClSw
          BuildingEnum.TownEstate, // WoWoSwSw
          BuildingEnum.Market, // SnSn
        ],
        players: [
          {
            ...s0.players[0],
            wood: 2,
            clay: 2,
            grain: 2,
            stone: 0,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)(['BUILD'])
      expect(c0).toStrictEqual([
        BuildingEnum.Priory, // WoCl
        BuildingEnum.FuelMerchant, // ClSw
      ])
    })
    it('gives all buildings, regardless of building materials, when in neutralBuildingPhase', () => {
      const s1: GameStatePlaying = {
        ...s0,
        buildings: [
          BuildingEnum.Priory, // WoCl
          BuildingEnum.CloisterCourtyard, // WoWo
          BuildingEnum.GrainStorage, // WoSw
          BuildingEnum.Windmill, // WoWoWoClCl
          BuildingEnum.Bakery, // ClClSw
        ],
        players: [
          {
            ...s0.players[0],
            wood: 0,
            clay: 0,
            straw: 0,
            stone: 0,
            penny: 0,
            wine: 0,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          neutralBuildingPhase: true,
          mainActionUsed: true,
          bonusActions: [GameCommandEnum.BUILD],
        },
      }
      const c0 = complete(s1)(['BUILD'])
      expect(c0).toStrictEqual(s1.buildings)
    })
    it('gives all the places the given building can be built', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
              [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['H', 'LB3'], [], []],
            ] as Tile[][],
            landscapeOffset: 0,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          bonusActions: [],
        },
        buildings: [BuildingEnum.StoneMerchant],
      }
      const c0 = complete(s1)(['BUILD', BuildingEnum.StoneMerchant])
      expect(c0).toStrictEqual(['3 0', '3 1'])
    })
    it('gives all the places a cloister can be built', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], ['H'], ['P'], ['P'], ['H'], ['H'], [], []],
              [['W'], ['C'], ['H'], ['P'], ['P'], ['P'], ['P', 'LG1'], [], []],
              [['W'], ['C'], ['P'], ['P'], ['P', 'LG2'], ['P', 'G01'], ['H', 'LG3'], [], []],
              [['W'], ['C'], ['H'], ['P'], ['P', 'G06'], ['H'], ['H'], [], []],
            ] as Tile[][],
            landscapeOffset: 1,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)(['BUILD', BuildingEnum.Priory])
      expect(c0).toStrictEqual(['3 0', '3 2', '4 2'])
    })
    it('neutral building phase building a cloister only on adjacent or overbuild', () => {
      const s1: GameStatePlaying = {
        ...s0,
        config: {
          ...s0.config,
          players: 1,
        },
        players: [
          {
            ...s0.players[0],
          },
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P', 'G12'], ['P'], ['P'], ['P'], ['P', 'LG1'], [], []],
              [[], [], ['P'], ['P'], ['P', 'LG2'], ['P', 'G01'], ['H', 'LG3'], [], []],
            ] as Tile[][],
            landscapeOffset: 0,
          },
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          neutralBuildingPhase: true,
          bonusActions: [GameCommandEnum.BUILD],
        },
      }
      const c0 = complete(s1)(['BUILD', BuildingEnum.Priory])
      expect(c0).toStrictEqual(['3 0', '3 1', '4 1'])
    })
    it('neutral building phase building a regular building', () => {
      const s1: GameStatePlaying = {
        ...s0,
        config: {
          ...s0.config,
          players: 1,
        },
        buildings: [BuildingEnum.Market],
        players: [
          {
            ...s0.players[0],
          },
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P', 'G12'], ['P'], ['P'], ['P'], ['P', 'LG1'], [], []],
              [[], [], ['P'], ['P'], ['P', 'LG2'], ['P', 'G01'], ['H', 'LG3'], [], []],
            ] as Tile[][],
            landscapeOffset: 0,
          },
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          neutralBuildingPhase: true,
          bonusActions: [GameCommandEnum.BUILD],
        },
      }
      const c0 = complete(s1)(['BUILD', BuildingEnum.Market])
      expect(c0).toStrictEqual(['0 0', '1 0', '2 0', '3 0', '4 0', '0 1', '1 1', '2 1'])
    })
    it('considers terrain type', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], [], [], [], [], [], [], []],
              [['W'], ['C'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
              [['W'], ['C', 'F04'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
              [['W'], ['C'], [], [], [], [], [], [], []],
              [['W'], ['C'], [], [], [], [], [], [], []],
            ] as Tile[][],
            landscapeOffset: 1,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)(['BUILD', BuildingEnum.HarborPromenade])
      expect(c0).toStrictEqual(['-1 -1', '-1 0', '-1 2', '-1 3'])
    })
    it('gives all the places a cloister can be built if given a col', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], ['H'], ['P'], ['P'], ['H'], ['H'], [], []],
              [['W'], ['C'], ['H'], ['P'], ['P', 'G05'], ['P'], ['P', 'LG1'], [], []],
              [['W'], ['C'], ['P'], ['P'], ['P', 'LG2'], ['P', 'G01'], ['H', 'LG3'], [], []],
              [['W'], ['C'], ['H'], ['P'], ['P', 'G06'], ['H'], ['H'], [], []],
            ] as Tile[][],
            landscapeOffset: 1,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)(['BUILD', BuildingEnum.Priory, '3'])
      expect(c0).toStrictEqual(['0', '2'])
    })
    it('complete if given all necessary params', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)(['BUILD', BuildingEnum.GrapevineA, '4', '1'])
      expect(c0).toStrictEqual([''])
    })
    it('cant complete if too many params', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)(['BUILD', BuildingEnum.GrapevineA, '4', '1', 'Wo'])
      expect(c0).toStrictEqual([])
    })
  })
})
