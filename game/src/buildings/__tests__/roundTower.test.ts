import { createPcg32 } from 'fn-pcg'
import {
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { roundTower, complete } from '../roundTower'

describe('buildings/roundTower', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: ['PRIB'] as Clergy[],
    settlements: [],
    landscape: [
      [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'G41'], ['H', 'LB1'], [], []],
      [['W'], ['C'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G01'], ['P', 'LB3', 'LB2B'], [], []],
      [['W'], ['C', 'G26', 'LB1B'], [], [], [], [], []],
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
    nickel: 10,
    malt: 0,
    coal: 0,
    book: 10,
    ceramic: 10,
    whiskey: 10,
    straw: 0,
    meat: 0,
    ornament: 10,
    bread: 0,
    wine: 0,
    beer: 0,
    reliquary: 10,
  }
  const s0 = {
    randGen: createPcg32({}, 42, 56),
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
    wonders: 8,
    players: [p0],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  } as GameStatePlaying

  describe('3 players', () => {
    it('retains undefined state', () => {
      const s1 = roundTower()(undefined)
      expect(s1).toBeUndefined()
    })

    it('noop if empty inputs', () => {
      const s1 = roundTower('')(s0)
      expect(s1).toBe(s0)
    })

    it('noop if missing inputs', () => {
      const s1 = roundTower()(s0)
      expect(s1).toBe(s0)
    })

    it('follows happy path', () => {
      const s1 = roundTower('WhNiOrOrOrBo')(s0)!
      expect(s1.players[0]).toMatchObject({
        whiskey: 9,
        nickel: 9,
        penny: 10,
        reliquary: 10,
        book: 9,
        ceramic: 10,
        ornament: 7,
        wonders: 1,
      })
    })

    it('can pay with pennies', () => {
      const s1 = roundTower('WhPnPnPnPnPnRqRqRqBo')(s0)!
      expect(s1.players[0]).toMatchObject({
        whiskey: 9,
        nickel: 10,
        penny: 5,
        reliquary: 7,
        book: 9,
        ceramic: 10,
        ornament: 10,
        wonders: 1,
      })
    })

    it('noop if underpaid pennies', () => {
      const s1 = roundTower('WhPnPnPnPnRqRqRqBo')(s0)!
      expect(s1).toBe(s0)
    })

    it('noop if no whiskey', () => {
      const s1 = roundTower('NiRqRqRqBo')(s0)!
      expect(s1).toBe(s0)
    })

    it('noop if not enough points', () => {
      const s1 = roundTower('WhNiOrOrCeBo')(s0)!
      expect(s1.players[0]).toBe(s0.players[0])
    })
  })

  describe('complete', () => {
    it('shows usage minimally', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            whiskey: 1,
            nickel: 1,
            book: 0,
            ceramic: 1,
            ornament: 1,
            reliquary: 2,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([
        'NiWhRqRq',
        'NiWhRqOrCe',
        'PnPnPnPnPnWhRqRq',
        'PnPnPnPnPnWhRqOrCe',
        'PnPnPnPnPnWhRqOrNi',
        '',
      ])
    })
    it('allows noop if not enough input', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            whiskey: 0,
            nickel: 1,
            reliquary: 2,
            ornament: 2,
            ceramic: 1,
            book: 3,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('finish command after 1 param', () => {
      const s1 = {
        ...s0,
        nickel: 1,
        whiskey: 1,
        reliquary: 2,
      } as GameStatePlaying
      const c0 = complete(['NiWhRqRq'])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('ignores more than one param', () => {
      const s1 = {
        ...s0,
      } as GameStatePlaying
      const c0 = complete(['Or', 'Bo'])(s1)
      expect(c0).toStrictEqual([])
    })
  })
})
