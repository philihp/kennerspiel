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
import { scriptorium, complete } from '../scriptorium'

describe('buildings/scriptorium', () => {
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
    penny: 1,
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
    whiskey: 10,
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
      country: 'ireland',
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
  }

  describe('scriptorium', () => {
    it('supports a noop with empty strings', () => {
      const s1 = scriptorium('')(s0)!
      expect(s1).toBe(s0)
      expect(s1.players[0]).toMatchObject({
        penny: 1,
        book: 0,
        meat: 0,
        whiskey: 10,
      })
    })

    it('supports a noop with no params', () => {
      const s1 = scriptorium()(s0)!
      expect(s1).toBe(s0)
      expect(s1.players[0]).toMatchObject({
        penny: 1,
        book: 0,
        meat: 0,
        whiskey: 10,
      })
    })

    it('works ordinarily', () => {
      const s1 = scriptorium('Pn')(s0)!
      expect(s1.players[0]).toMatchObject({
        penny: 0,
        book: 1,
        meat: 1,
        whiskey: 11,
      })
    })

    it('consumes everything you give it', () => {
      const s1 = scriptorium('Wh')(s0)!
      expect(s1.players[0]).toMatchObject({
        penny: 1,
        book: 1,
        meat: 1,
        whiskey: 10,
      })
    })
  })

  describe('complete', () => {
    it('allows noop usage', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            nickel: 0,
            whiskey: 0,
            wine: 0,
          },
          s0.players.slice(1),
        ] as Tableau[],
      }
      const c0 = complete([], s1)
      expect(c0).toStrictEqual([''])
    })
    it('lists valid payments', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
            nickel: 1,
            whiskey: 0,
            wine: 1,
          },
          s0.players.slice(1),
        ] as Tableau[],
      }
      const c0 = complete([], s1)
      expect(c0).toStrictEqual(['Pn', 'Ni', 'Wn', ''])
    })
    it('puts pennies first', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
            nickel: 1,
            whiskey: 1,
            wine: 1,
          },
          s0.players.slice(1),
        ] as Tableau[],
      }
      const c0 = complete([], s1)
      expect(c0[0]).toBe('Pn')
    })
    it('ends after 1 param', () => {
      const c0 = complete(['Pn'], s0)
      expect(c0).toStrictEqual([''])
    })
    it('fails if multiple params', () => {
      const c0 = complete(['Pn', 'Pn'], s0)
      expect(c0).toStrictEqual([])
    })
  })
})
