import { describe, it, expect } from '../../testHelpers'
import { initialState } from '../../state'
import {
  GameState,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { forgersWorkshop, complete } from '../forgersWorkshop'

describe('buildings/forgersWorkshop', () => {
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
    nickel: 10,
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
  const s0: GameState = {
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

  describe('forgersWorkshop', () => {
    it('can do a noop', () => {
      const s1 = forgersWorkshop()(undefined)!
      expect(s1).toBeUndefined()
    })

    it('can do a noop with no input', () => {
      const s1 = forgersWorkshop('')(undefined)!
      expect(s1).toBeUndefined()
    })

    it('bare use is a legal no-op, never a negative reliquary', () => {
      // complete([]) offers '' even for a broke player; the reducer must
      // accept it without granting floor((0-5)/10) = -1 reliquaries
      const s1 = forgersWorkshop()(s0)
      expect(s1).toBe(s0)
    })

    it('rejects paying 1-4 coins (buys nothing)', () => {
      const s1 = forgersWorkshop('Pn')(s0)
      expect(s1).toBeUndefined()
    })

    it('can do both things', () => {
      const s1 = forgersWorkshop('NiNiNi')(s0)!
      expect(s1.players![0]).toMatchObject({
        reliquary: 2,
        nickel: 7,
      })
    })

    it('can do just one', () => {
      const s1 = forgersWorkshop('Ni')(s0)!
      expect(s1.players![0]).toMatchObject({
        reliquary: 1,
        nickel: 9,
      })
    })

    it('can do it 3 times', () => {
      // 25 coins (5 nickels) -> 3 reliquaries
      const s1 = forgersWorkshop('NiNiNiNiNi')(s0)!
      expect(s1.players![0]).toMatchObject({
        reliquary: 3,
        nickel: 5,
      })
    })

    it('can do it 4 times', () => {
      const s1 = forgersWorkshop('NiNiNiNiNiNiNi')(s0)!
      expect(s1.players![0]).toMatchObject({
        reliquary: 4,
        nickel: 3,
      })
    })

    it('can do it 5 times', () => {
      // 45 coins (9 nickels) -> 5 reliquaries
      const s1 = forgersWorkshop('NiNiNiNiNiNiNiNiNi')(s0)!
      expect(s1.players![0]).toMatchObject({
        reliquary: 5,
        nickel: 1,
      })
    })

    it('scales 5+10n: each extra reliquary costs 10 more coins', () => {
      // Pay in pennies so the coin amount is exact (no nickel rounding).
      const withPennies = (penny: number): GameState => ({
        ...s0,
        players: [{ ...s0.players![0], nickel: 0, penny }, ...s0.players!.slice(1)],
      })
      const pay = (penny: number) => forgersWorkshop('Pn'.repeat(penny))(withPennies(penny))!.players![0].reliquary
      expect(pay(5)).toBe(1)
      expect(pay(15)).toBe(2)
      expect(pay(25)).toBe(3)
      expect(pay(35)).toBe(4)
      expect(pay(45)).toBe(5)
    })
  })

  describe('complete', () => {
    it('allows usage at 5 or 15', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players![0],
            nickel: 4,
          },
          s0.players!.slice(1),
        ],
      } as GameState
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['NiNiNi', 'Ni', ''])
    })
    it('offers every affordable tier beyond 15 (5+10n scaling)', () => {
      // p0 has 10 nickels = 50 coins, so 5/15/25/35/45 are all affordable
      // (1/2/3/4/5 reliquaries). The engine previously capped this at 15 -> 2.
      const c0 = complete([])(s0)
      expect(c0).toStrictEqual([
        'NiNiNiNiNiNiNiNiNi', // 45 coins -> 5 reliquaries
        'NiNiNiNiNiNiNi', // 35 coins -> 4 reliquaries
        'NiNiNiNiNi', // 25 coins -> 3 reliquaries
        'NiNiNi', // 15 coins -> 2 reliquaries
        'Ni', // 5 coins -> 1 reliquary
        '',
      ])
    })
    it('offers usage at 5, 15, and 25', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players![0],
            nickel: 6, // 30 coins: affords 5/15/25 but not 35
          },
          ...s0.players!.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['NiNiNiNiNi', 'NiNiNi', 'Ni', ''])
    })
    it('allows mixed inputs', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players![0],
            nickel: 2,
            whiskey: 2,
            penny: 3,
          },
          s0.players!.slice(1),
        ],
      } as GameState
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([
        'NiNiPnWhWh',
        'NiNiPnPnWhWh',
        'NiNiPnPnPnWh',
        'Ni',
        'PnWhWh',
        'PnPnWhWh',
        'PnPnPnWh',
        '',
      ])
    })
    it('allows noop if not enough input', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players![0],
            nickel: 0,
          },
          s0.players!.slice(1),
        ],
      } as GameState
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('can only pay with 1 nickel', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players![0],
            nickel: 2,
          },
          s0.players!.slice(1),
        ],
      } as GameState
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['Ni', ''])
    })
    it('finish command after 1 param', () => {
      const s1 = {
        ...s0,
      }
      const c0 = complete(['NiNiNi'])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('ignores more than one param', () => {
      const s1 = {
        ...s0,
      }
      const c0 = complete(['Or', 'Bo'])(s1)
      expect(c0).toStrictEqual([])
    })
  })
})
