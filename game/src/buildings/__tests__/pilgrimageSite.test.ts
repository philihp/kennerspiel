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
import { pilgrimageSite, complete } from '../pilgrimageSite'

describe('buildings/pilgrimageSite', () => {
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
    book: 10,
    ceramic: 10,
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
      grape: 1,
      joker: 2,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }
  describe('pilgrimageSite', () => {
    it('retains undefined state', () => {
      const s1 = pilgrimageSite('')(undefined)!
      expect(s1).toBeUndefined()
    })

    it('allows noop', () => {
      const s1 = pilgrimageSite()(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 10,
        ornament: 10,
        ceramic: 10,
        reliquary: 10,
      })
    })
    it('can do one conversion', () => {
      const s1 = pilgrimageSite('Bo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 9,
        ornament: 10,
        ceramic: 11,
        reliquary: 10,
      })
    })
    it('can do two conversions', () => {
      const s1 = pilgrimageSite('Or', 'Or')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 10,
        ornament: 8,
        ceramic: 10,
        reliquary: 12,
      })
    })
    it('can do two conversions on the same thing', () => {
      const s1 = pilgrimageSite('Bo', 'Po')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 9,
        ornament: 11,
        ceramic: 10,
        reliquary: 10,
      })
    })
    it('two conversions on first param will just fail', () => {
      const s1 = pilgrimageSite('BoBoBo')(s0)!
      expect(s1).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('allows usage at 5 or 15', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            book: 1,
            ceramic: 0,
            ornament: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['Bo', 'Or', ''])
    })
    it('options given first param converts a book', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            book: 1,
            ceramic: 0,
            ornament: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete(['Bo'])(s1)
      expect(c0).toStrictEqual(['Ce', 'Or', ''])
    })
    it('finish command after two params', () => {
      const s1 = {
        ...s0,
      } as GameStatePlaying
      const c0 = complete(['Bo', 'Ce'])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('ignores more than two param', () => {
      const s1 = {
        ...s0,
      } as GameStatePlaying
      const c0 = complete(['Bo', 'Ce', 'Or'])(s1)
      expect(c0).toStrictEqual([])
    })
  })
})
