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
import { buildersMarket, complete } from '../buildersMarket'

describe('buildings/buildersMarket', () => {
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
    penny: 10,
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

  describe('buildersMarket', () => {
    it('goes through a happy path', () => {
      const s1 = buildersMarket('PnPn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 8,
        wood: 2,
        clay: 2,
        stone: 1,
        straw: 1,
      })
    })

    it('exchanges a nickel for pennies', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            nickel: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = buildersMarket('PnPn')(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        penny: 3,
        wood: 2,
        clay: 2,
        stone: 1,
        straw: 1,
      })
    })

    it('does nothing if you dont give it two coins', () => {
      const s1 = buildersMarket()(s0)! as GameStatePlaying
      expect(s1).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('gives the option of PnPn if player has pennies', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['PnPn', ''])
    })
    it('only allows nothing if not enough money', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('will offer to exchange a nickel for pennies', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            nickel: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['PnPn', ''])
    })
    it('once it knows, that is it', () => {
      const c0 = complete(['PnPn'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('does not complete anything with a param', () => {
      const c0 = complete(['Pn', 'Pn'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
