import { initialState } from '../../state'
import {
  BuildingEnum,
  GameCommandEnum,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementEnum,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { complete, settle } from '../settle'

describe('commands/build', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: ['SB1', 'SB2', 'SB3', 'SB4'] as SettlementEnum[],
    landscape: [
      [['W'], ['C'], [], [], [], [], [], [], []],
      [['W'], ['C'], [], [], [], [], [], [], []],
      [['W'], ['C'], [], [], [], [], [], [], []],
      [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['P', 'LB1'], [], []],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 3,
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
    coal: 5,
    book: 0,
    ceramic: 0,
    whiskey: 0,
    straw: 0,
    meat: 5,
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
      bonusActions: [GameCommandEnum.SETTLE, GameCommandEnum.CUT_PEAT],
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
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [],
    districtPurchasePrices: [],
  }

  describe('settlement', () => {
    it('fails when settlement is not available', () => {
      const s1 = settle({ row: -2, col: -1, resources: 'CoCoCoCoCoMtMtMt', settlement: SettlementEnum.VillageB })(s0)!
      expect(s1).toBeUndefined()
    })
    it('fails when erection present', () => {
      const s1 = settle({ row: 0, col: 4, resources: 'CoMt', settlement: SettlementEnum.ShantyTownB })(s0)!
      expect(s1).toBeUndefined()
    })
    it('fails when settling on an incorrect land type', () => {
      const s1 = settle({ row: -2, col: -2, resources: 'CoCoMtMt', settlement: SettlementEnum.FishingVillageB })(s0)!
      expect(s1).toBeUndefined()
    })
    it('fails when player cant afford settlement', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            coal: 0,
            meat: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = settle({ row: -2, col: -1, resources: 'CoCoMtMt', settlement: SettlementEnum.FishingVillageB })(s1)!
      expect(s2).toBeUndefined()
    })
    it('fails when no bonus action available', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          bonusActions: [],
        },
      }
      const s2 = settle({ row: -2, col: -1, resources: 'CoCoMtMt', settlement: SettlementEnum.FishingVillageB })(s1)!
      expect(s2).toBeUndefined()
    })
    it('settles when everything is above board', () => {
      const s1 = settle({ row: -2, col: -1, resources: 'CoCoMtMt', settlement: SettlementEnum.FishingVillageB })(s0)!
      expect(s1).toBeDefined()
      expect(s1.buildings).not.toContain(BuildingEnum.Windmill)
      expect(s1.players[0]).toMatchObject({
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C', 'SB4'], [], [], [], [], [], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['P', 'LB1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
        ],
        coal: 3,
        meat: 3,
      })
    })
  })

  describe('complete', () => {
    it('allows running if in a settlement frame', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          bonusActions: [GameCommandEnum.SETTLE],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['SETTLE'])
    })
    it('does not allow running if not in a settlement frame', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('does not allow if none of their settlements can be built', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('gives all of the active player settlements, if there are any', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            settlements: ['SR1', 'SR3', 'SR5', 'SR6'] as SettlementEnum[],
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)(['SETTLE'])
      expect(c0).toStrictEqual(['SR1', 'SR3', 'SR5', 'SR6'])
    })
    it('only gives settlements that the player can afford', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            settlements: ['SR1', 'SR2', 'SR3', 'SR4'] as SettlementEnum[],
            wood: 1,
            peat: 0,
            coal: 0,
            straw: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)(['SETTLE'])
      expect(c0).toStrictEqual(['SR1', 'SR3'])
    })
    it('only gives spots that match the building', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H'], [], []],
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['P', 'LB1'], [], []],
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
            ] as Tile[][],
            landscapeOffset: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)(['SETTLE', 'SR4']) // Fishing Village can only be on coast
      expect(c0).toStrictEqual(['-1 -1', '-1 0'])
    })
    it('gives no settlements if there are none', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H'], [], []],
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['P', 'LB1'], [], []],
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
            ] as Tile[][],
            landscapeOffset: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)(['SETTLE', 'SR6'])
      expect(c0).toStrictEqual(['-1 -1', '3 -1', '4 -1', '-1 0', '3 0', '3 1'])
    })
    it('gives rows that the first col is free', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H'], [], []],
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['P', 'LB1'], [], []],
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
            ] as Tile[][],
            landscapeOffset: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)(['SETTLE', 'SR8', '3'])
      expect(c0).toStrictEqual(['-1', '0'])
    })
    it('gives ways of paying for the given thing', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H'], [], []],
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['P', 'LB1'], [], []],
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
            ] as Tile[][],
            landscapeOffset: 1,
            peat: 0,
            penny: 1,
            clay: 0,
            wood: 5,
            grain: 1,
            sheep: 5,
            stone: 0,
            flour: 0,
            grape: 0,
            nickel: 0,
            malt: 0,
            coal: 5,
            book: 0,
            ceramic: 0,
            whiskey: 0,
            straw: 0,
            meat: 5,
            ornament: 0,
            bread: 0,
            wine: 0,
            beer: 0,
            reliquary: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)(['SETTLE', 'SR6', '-1', '0'])
      // 5 food 6 energy
      expect(c0).toStrictEqual([
        // this sort is intentional, because people probably want to eat meat first
        'MtCoCo',
        'MtCoWoWoWo',
        'ShShShCoCo',
        'ShShShCoWoWoWo',
        'ShShGnCoCo',
        'ShShGnCoWoWoWo',
        'ShShPnCoCo',
        'ShShPnCoWoWoWo',
      ])
    })

    it('gives a termination if the command is complete', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H'], [], []],
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['P', 'LB1'], [], []],
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
            ] as Tile[][],
            landscapeOffset: 1,
            peat: 0,
            penny: 1,
            clay: 0,
            wood: 5,
            grain: 1,
            sheep: 5,
            stone: 0,
            flour: 0,
            grape: 0,
            nickel: 0,
            malt: 0,
            coal: 5,
            book: 0,
            ceramic: 0,
            whiskey: 0,
            straw: 0,
            meat: 5,
            ornament: 0,
            bread: 0,
            wine: 0,
            beer: 0,
            reliquary: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)(['SETTLE', 'SR6', '-1', '0', 'MtCoCo'])
      expect(c0).toStrictEqual([''])
    })

    it('doesnt continue anything else', () => {
      const c0 = complete(s0)(['HELLO'])
      expect(c0).toStrictEqual([])
    })
  })
})
