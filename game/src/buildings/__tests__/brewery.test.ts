import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { initialState } from '../../state'
import { brewery, complete } from '../brewery'

describe('buildings/brewery', () => {
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
    penny: 0,
    clay: 0,
    wood: 0,
    grain: 0,
    sheep: 0,
    stone: 0,
    malt: 0,
    grape: 0,
    nickel: 0,
    flour: 0,
    coal: 0,
    book: 0,
    ceramic: 0,
    whiskey: 0,
    straw: 0,
    meat: 0,
    ornament: 0,
    beer: 0,
    wine: 0,
    bread: 0,
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
  describe('brewery', () => {
    it('retains undefined state', () => {
      const s1 = brewery()(undefined)
      expect(s1).toBeUndefined()
    })
    it('brews beer using wood, then converts to coins', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 10,
            penny: 0,
            nickel: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('GnMaMaBe')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 9,
        malt: 8,
        beer: 10,
        penny: 2,
        nickel: 1,
      })
    })
    it('brews beer with no coin conversion', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            beer: 10,
            nickel: 0,
            penny: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('GnMa')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 9,
        malt: 9,
        beer: 11,
        penny: 0,
        nickel: 0,
      })
    })
    it('can sell beer without brewing', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 0,
            malt: 0,
            beer: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('Be')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 0,
        malt: 0,
        beer: 0,
        nickel: 1,
        penny: 2,
      })
    })
    it('does not allow selling beer you dont have and arent making', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('BeBe')(s1)!
      expect(s2).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('gives empty string if nothing possible', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 0,
            malt: 0,
            beer: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('gives only sell 1 beer if they cant brew because no malt', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 4,
            malt: 0,
            beer: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['', 'Be'])
    })
    it('gives only sell 1 beer if they cant brew because no grain', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 0,
            malt: 4,
            beer: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['', 'Be'])
    })
    it('if they can brew only 1, but have no beer, they can still brew and sell', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 1,
            malt: 1,
            beer: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['', 'GnMa', 'GnMaBe'])
    })
    it('if they can brew only 2, but have no beer, they can still brew and sell', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 2,
            malt: 2,
            beer: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['', 'GnMa', 'GnMaBe', 'GnGnMaMa', 'GnGnMaMaBe'])
    })
    it('suggests they can only brew as many as they can', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 2,
            malt: 5,
            beer: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['', 'GnMa', 'GnMaBe', 'GnGnMaMa', 'GnGnMaMaBe'])
    })
  })
})
