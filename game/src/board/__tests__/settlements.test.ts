import { initialState } from '../../state'
import {
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementEnum,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { roundSettlements, introduceSettlements, costForSettlement } from '../settlements'

describe('board/settlements', () => {
  describe('costForSettlement', () => {
    it('has the proper cost for shanty town', () => {
      expect(costForSettlement(SettlementEnum.ShantyTownB)).toMatchObject({
        energy: 1,
        food: 1,
      })
    })
    it('has the proper cost for farming village', () => {
      expect(costForSettlement(SettlementEnum.FarmingVillageB)).toMatchObject({
        energy: 3,
        food: 3,
      })
    })
    it('has the proper cost for market town', () => {
      expect(costForSettlement(SettlementEnum.MarketTownB)).toMatchObject({
        energy: 0,
        food: 7,
      })
    })
    it('has the proper cost for fishing village', () => {
      expect(costForSettlement(SettlementEnum.FishingVillageB)).toMatchObject({
        energy: 3,
        food: 8,
      })
    })
    it('has the proper cost for artists colony', () => {
      expect(costForSettlement(SettlementEnum.ArtistsColonyB)).toMatchObject({
        energy: 1,
        food: 5,
      })
    })
    it('has the proper cost for hamlet', () => {
      expect(costForSettlement(SettlementEnum.HamletB)).toMatchObject({
        energy: 6,
        food: 5,
      })
    })
    it('has the proper cost for village', () => {
      expect(costForSettlement(SettlementEnum.VillageB)).toMatchObject({
        energy: 9,
        food: 15,
      })
    })
    it('has the proper cost for hilltop village', () => {
      expect(costForSettlement(SettlementEnum.HilltopVillageB)).toMatchObject({
        energy: 3,
        food: 30,
      })
    })
  })

  describe('roundSettlements', () => {
    it('returns list for settlement L', () => {
      expect.assertions(4)
      expect(roundSettlements(PlayerColor.Red, SettlementRound.L)).toStrictEqual([])
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.L)).toStrictEqual([])
      expect(roundSettlements(PlayerColor.Green, SettlementRound.L)).toStrictEqual([])
      expect(roundSettlements(PlayerColor.White, SettlementRound.L)).toStrictEqual([])
    })
    it('returns list for settlement S', () => {
      expect.assertions(4)
      expect(roundSettlements(PlayerColor.Red, SettlementRound.S)).toStrictEqual(['SR1', 'SR2', 'SR3', 'SR4'])
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.S)).toStrictEqual(['SB1', 'SB2', 'SB3', 'SB4'])
      expect(roundSettlements(PlayerColor.Green, SettlementRound.S)).toStrictEqual(['SG1', 'SG2', 'SG3', 'SG4'])
      expect(roundSettlements(PlayerColor.White, SettlementRound.S)).toStrictEqual(['SW1', 'SW2', 'SW3', 'SW4'])
    })
    it('returns list for settlement A', () => {
      expect.assertions(4)
      expect(roundSettlements(PlayerColor.Red, SettlementRound.A)).toStrictEqual(['SR5'])
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.A)).toStrictEqual(['SB5'])
      expect(roundSettlements(PlayerColor.Green, SettlementRound.A)).toStrictEqual(['SG5'])
      expect(roundSettlements(PlayerColor.White, SettlementRound.A)).toStrictEqual(['SW5'])
    })
    it('returns list for settlement B', () => {
      expect.assertions(4)
      expect(roundSettlements(PlayerColor.Red, SettlementRound.B)).toStrictEqual(['SR6'])
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.B)).toStrictEqual(['SB6'])
      expect(roundSettlements(PlayerColor.Green, SettlementRound.B)).toStrictEqual(['SG6'])
      expect(roundSettlements(PlayerColor.White, SettlementRound.B)).toStrictEqual(['SW6'])
    })
    it('returns list for settlement C', () => {
      expect.assertions(4)
      expect(roundSettlements(PlayerColor.Red, SettlementRound.C)).toStrictEqual(['SR7'])
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.C)).toStrictEqual(['SB7'])
      expect(roundSettlements(PlayerColor.Green, SettlementRound.C)).toStrictEqual(['SG7'])
      expect(roundSettlements(PlayerColor.White, SettlementRound.C)).toStrictEqual(['SW7'])
    })
    it('returns list for settlement D', () => {
      expect.assertions(4)
      expect(roundSettlements(PlayerColor.Red, SettlementRound.D)).toStrictEqual(['SR8'])
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.D)).toStrictEqual(['SB8'])
      expect(roundSettlements(PlayerColor.Green, SettlementRound.D)).toStrictEqual(['SG8'])
      expect(roundSettlements(PlayerColor.White, SettlementRound.D)).toStrictEqual(['SW8'])
    })
    it('returns list for settlement E', () => {
      expect.assertions(4)
      expect(roundSettlements(PlayerColor.Red, SettlementRound.E)).toStrictEqual([])
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.E)).toStrictEqual([])
      expect(roundSettlements(PlayerColor.Green, SettlementRound.E)).toStrictEqual([])
      expect(roundSettlements(PlayerColor.White, SettlementRound.E)).toStrictEqual([])
    })
  })

  describe('board/frame/introduceSettlements', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: ['LB1B', 'LB2B', 'PRIB'] as Clergy[],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 0,
      peat: 0,
      penny: 100,
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
        pointingBefore: 0,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
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

    it('retains undefined state', () => {
      const s1 = introduceSettlements(undefined)!
      expect(s1).toBeUndefined()
    })

    it('adds some settlements', () => {
      const s1 = introduceSettlements(s0)!
      expect(s0.players[0].settlements).toHaveLength(0)
      expect(s1.players[0].settlements).not.toHaveLength(0)
    })
  })
})
