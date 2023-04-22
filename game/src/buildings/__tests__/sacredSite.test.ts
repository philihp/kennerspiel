import { initialState } from '../../state'
import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { complete, sacredSite } from '../sacredSite'

describe('buildings/sacredSite', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 0,
    peat: 0,
    penny: 4,
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
      pointingBefore: 0,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('sacredSite', () => {
    it('retains undefined state', () => {
      const s1 = sacredSite()(undefined)!
      expect(s1).toBeUndefined()
    })
    it('allows a noop with empty string', () => {
      const s1 = sacredSite('')(s0)!
      expect(s1.players[0]).toMatchObject({
        grain: 0,
        malt: 0,
        whiskey: 0,
        beer: 0,
        book: 1,
      })
    })
    it('allows a noop with missing param', () => {
      const s1 = sacredSite()(s0)!
      expect(s1.players[0]).toMatchObject({
        grain: 0,
        malt: 0,
        whiskey: 0,
        beer: 0,
        book: 1,
      })
    })
    it('gives grain and beer', () => {
      const s1 = sacredSite('GnBe')(s0)!
      expect(s1.players[0]).toMatchObject({
        grain: 2,
        malt: 0,
        whiskey: 0,
        beer: 1,
        book: 1,
      })
    })
    it('gives malt and whiskey', () => {
      const s1 = sacredSite('MaWh')(s0)!
      expect(s1.players[0]).toMatchObject({
        grain: 0,
        malt: 2,
        whiskey: 1,
        beer: 0,
        book: 1,
      })
    })
    it('gives neither if both are specified', () => {
      const s1 = sacredSite('GnMaBe')(s0)!
      expect(s1.players[0]).toMatchObject({
        grain: 0,
        malt: 0,
        whiskey: 0,
        beer: 1,
        book: 1,
      })
    })
  })

  describe('complete', () => {
    it('just wants to know grain/malt and beer/whiskey, if only it were that simple', () => {
      const c0 = complete([])(s0)
      expect(c0).toStrictEqual(['GnGnBe', 'GnGnWh', 'MaMaBe', 'MaMaWh'])
    })
    it('completes on one param', () => {
      const c0 = complete(['GnGnBe'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('wont complete on two params', () => {
      const c0 = complete(['Gn', 'Be'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
