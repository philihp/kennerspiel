import { initialState } from '../../reducer'
import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { pilgrimageSite } from '../pilgrimageSite'

describe('buildings/pilgrimageSite', () => {
  describe('pilgrimageSite', () => {
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
      book: 10,
      pottery: 10,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 10,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 10,
    }
    const s0: GameStatePlaying = {
      ...initialState,
      status: GameStatusEnum.PLAYING,
      activePlayerIndex: 0,
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 3,
        grape: 1,
        joker: 2,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      settling: false,
      extraRound: false,
      moveInRound: 1,
      round: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
      buildings: [],
      nextUse: NextUseClergy.Any,
      canBuyLandscape: true,
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
      neutralBuildingPhase: false,
      mainActionUsed: false,
      bonusActions: [],
    }

    it('retains undefined state', () => {
      const s1 = pilgrimageSite('')(undefined)!
      expect(s1).toBeUndefined()
    })

    it('allows noop', () => {
      const s1 = pilgrimageSite()(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 10,
        ornament: 10,
        pottery: 10,
        reliquary: 10,
      })
    })
    it('can do one conversion', () => {
      const s1 = pilgrimageSite('OrBoRqPo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 9,
        ornament: 10,
        pottery: 10,
        reliquary: 11,
      })
    })
    it('can do two conversions', () => {
      const s1 = pilgrimageSite('BoOrPoRqBoOrPoRq')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 8,
        ornament: 10,
        pottery: 10,
        reliquary: 12,
      })
    })
    it('three conversions just get eaten', () => {
      const s1 = pilgrimageSite('BoBoBoPoPoPoOrOrOr')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 7,
        ornament: 9,
        pottery: 9,
        reliquary: 12,
      })
    })
    it('handles unbalanced input', () => {
      const s1 = pilgrimageSite('BoBoPoOrOr')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 8,
        ornament: 9,
        pottery: 10,
        reliquary: 11,
      })
    })
  })
})
