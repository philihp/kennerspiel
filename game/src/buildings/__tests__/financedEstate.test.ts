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
import { financedEstate, complete } from '../financedEstate'

describe('buildings/financedEstate', () => {
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

  describe('financedEstate', () => {
    it('goes through a happy path', () => {
      const s1 = financedEstate('Pn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 0,
        book: 1,
        bread: 1,
        grape: 2,
        flour: 2,
      })
    })

    it('allows a noop', () => {
      const s1 = financedEstate('')(s0)!
      expect(s1.players[0]).toStrictEqual(s0.players[0])
    })

    it('allows a noop with undefined', () => {
      const s1 = financedEstate()(s0)!
      expect(s1.players[0]).toStrictEqual(s0.players[0])
    })

    it('can pay with wine', () => {
      const s1 = { ...s0, players: [{ ...s0.players[0], penny: 0, wine: 1 }, ...s0.players.slice(1)] }
      const s2 = financedEstate('Wn')(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        penny: 0,
        wine: 0,
        book: 1,
        bread: 1,
        grape: 2,
        flour: 2,
      })
    })

    it('cant pay with clay', () => {
      const s1 = { ...s0, players: [{ ...s0.players[0], penny: 0, clay: 1 }, ...s0.players.slice(1)] }
      const s2 = financedEstate('Cl')(s1)! as GameStatePlaying
      expect(s2).toBeUndefined()
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
