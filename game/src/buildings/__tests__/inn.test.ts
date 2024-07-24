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
import { inn, complete } from '../inn'

describe('buildings/inn', () => {
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
    grain: 10,
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
    meat: 10,
    ornament: 0,
    bread: 0,
    wine: 10,
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

  describe('inn', () => {
    it('goes through a happy path', () => {
      const s1 = inn('WnMtGnGnGn')(s0)!
      expect(s1.players[0]).toMatchObject({
        wine: 9,
        meat: 9,
        grain: 7,
        penny: 8,
        nickel: 1,
      })
    })

    it('has a max payout of 13, with 1 nickel and 8 pennies', () => {
      const s1 = inn('WnMtMtMtMtMtMt')(s0)!
      expect(s1.players[0]).toMatchObject({
        wine: 9,
        meat: 4,
        grain: 10,
        penny: 8,
        nickel: 1,
      })
    })

    it('pays out 6 if only given wine', () => {
      const s1 = inn('Wn')(s0)!
      expect(s1.players[0]).toMatchObject({
        wine: 9,
        meat: 10,
        grain: 10,
        penny: 1,
        nickel: 1,
      })
    })

    it('pays out 7 if only given two wine', () => {
      const s1 = inn('WnWn')(s0)!
      expect(s1.players[0]).toMatchObject({
        wine: 8,
        meat: 10,
        grain: 10,
        penny: 2,
        nickel: 1,
      })
    })

    it('pays out 1 if given 1 food', () => {
      const s1 = inn('Gn')(s0)!
      expect(s1.players[0]).toMatchObject({
        wine: 10,
        meat: 10,
        grain: 9,
        penny: 1,
        nickel: 0,
      })
    })
  })

  describe('complete', () => {
    it('if meat and wine...', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            wine: 1,
            meat: 2,
            sheep: 0,
            grain: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['MtMtWn', 'MtMt', 'MtWn', 'Mt', 'Wn', ''])
    })
    it('gives all combinations of one food things', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            wine: 2,
            meat: 0,
            sheep: 0,
            grain: 2,
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([
        'GnGnPnPnWnWn',
        'GnPnPnWnWn',
        'GnGnPnWnWn',
        'GnGnPnPnWn',
        'GnGnPnPn',
        'PnPnWnWn',
        'GnPnWnWn',
        'GnPnPnWn',
        'GnGnWnWn',
        'GnGnPnWn',
        'GnPnPn',
        'GnGnPn',
        'PnWnWn',
        'PnPnWn',
        'GnWnWn',
        'GnPnWn',
        'GnGnWn',
        'GnGn',
        'PnPn',
        'GnPn',
        'WnWn',
        'PnWn',
        'GnWn',
        'Gn',
        'Pn',
        'Wn',
        '',
      ])
    })
    it('multiple types to make food', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            wine: 1,
            meat: 2,
            sheep: 4,
            grain: 1,
            penny: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([
        'MtMtWn',
        'MtMt',
        'ShShShShWn',
        'ShShShSh',
        'MtShWn',
        'MtSh',
        'ShShShGnWn',
        'ShShShGn',
        'ShShShPnWn',
        'ShShShPn',
        'MtGnPnWn',
        'MtGnPn',
        'ShShGnPnWn',
        'ShShShWn',
        'MtPnWn',
        'MtGnWn',
        'ShShSh',
        'MtGn',
        'ShShGnPn',
        'MtPn',
        'ShShPnWn',
        'ShShGnWn',
        'MtWn',
        'Mt',
        'ShShGn',
        'ShShPn',
        'ShGnPnWn',
        'ShShWn',
        'ShSh',
        'ShGnPn',
        'ShPnWn',
        'ShGnWn',
        'ShGn',
        'ShPn',
        'GnPnWn',
        'ShWn',
        'Sh',
        'GnPn',
        'PnWn',
        'GnWn',
        'Gn',
        'Pn',
        'Wn',
        '',
      ])
    })
    it('complete if given a param', () => {
      const c0 = complete(['Pn'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('dont allow complete with two params', () => {
      const c0 = complete(['Pn', 'Pn'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
