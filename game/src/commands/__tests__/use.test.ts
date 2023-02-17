import { initialState } from '../../state'
import {
  BuildingEnum,
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  LandEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { use } from '../use'

describe('commands/use', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [['W'], ['C'], [], [], [], [], [], [], []],
      [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 1,
    peat: 0,
    penny: 1,
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
    config: {
      country: 'france',
      players: 3,
      length: 'long',
    },
    rondel: {
      pointingBefore: 3,
      joker: 2,
      sheep: 1,
      grain: 0,
    },
    wonders: 0,
    players: [
      {
        ...p0,
        color: PlayerColor.Red,
        clergy: ['LB1R', 'LB2R', 'PRIR'] as Clergy[],
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LR1'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
      {
        ...p0,
        color: PlayerColor.Green,
        clergy: ['LB1G', 'LB2G', 'PRIG'] as Clergy[],
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LG1'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LG2'], ['P'], ['P', 'LG3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
      {
        ...p0,
        color: PlayerColor.Blue,
        clergy: ['LB1B', 'LB2B', 'PRIB'] as Clergy[],
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
    ],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
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
  }

  describe('use', () => {
    it('throws errors on invalid building', () => {
      expect(() => use('XXX' as unknown as BuildingEnum, [])(s0)).toThrow()
    })
    it('retains undefined state', () => {
      const s1 = use(BuildingEnum.ClayMoundR, ['Jo'])(undefined)!
      expect(s1).toBeUndefined()
    })
    it('moves next clergyman to the building', () => {
      const s1 = {
        ...s0,
      }
      const s2 = use(BuildingEnum.FarmYardR, ['Sh'])(s1)!
      expect(s1.frame.activePlayerIndex).toBe(0)
      expect(s1.players[0].clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])
      expect(s2.players[0].clergy).toStrictEqual(['LB2R', 'PRIR'])
      expect(s2.players[0].landscape[2][4]).toStrictEqual(['P', 'LR2', 'LB1R'])
    })
    it('fallback to prior if laypeople are used', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], clergy: [Clergy.PriorR] }, ...s0.players.slice(1)],
      }
      const s2 = use(BuildingEnum.FarmYardR, ['ShJo'])(s1)!
      expect(s1.frame.activePlayerIndex).toBe(0)
      expect(s1.players[0].landscape[2][4]).toStrictEqual(['P', 'LR2'])
      expect(s1.players[0].clergy).toStrictEqual(['PRIR'])
      expect(s2.players[0].clergy).toStrictEqual([])
      expect(s2.players[0].landscape[2][4]).toStrictEqual(['P', 'LR2', 'PRIR'])
    })
    it('gathers the goods', () => {
      const s1 = {
        ...s0,
      }
      const s2 = use(BuildingEnum.FarmYardR, ['Sh'])(s1)!
      expect(s1.frame.activePlayerIndex).toBe(0)
      expect(s1.players[0]).toMatchObject({
        sheep: 0,
        grain: 0,
      })
      expect(s1.rondel).toMatchObject({
        sheep: 1,
        grain: 0,
        joker: 2,
      })
      expect(s2.players[0]).toMatchObject({
        sheep: 3,
        grain: 0,
      })
      expect(s2.rondel).toMatchObject({
        sheep: 3,
        grain: 0,
        joker: 2,
      })
    })
    it('can use a joker', () => {
      const s1 = {
        ...s0,
      }
      const s2 = use(BuildingEnum.FarmYardR, ['ShJo'])(s1)!
      expect(s1.frame.activePlayerIndex).toBe(0)
      expect(s1.players[0]).toMatchObject({
        sheep: 0,
        grain: 0,
      })
      expect(s1.rondel).toMatchObject({
        joker: 2,
        sheep: 1,
        grain: 0,
      })
      expect(s2.players[0]).toMatchObject({
        sheep: 2,
        grain: 0,
      })
      expect(s2.rondel).toMatchObject({
        joker: 3,
        sheep: 1,
        grain: 0,
      })
    })
  })
})
