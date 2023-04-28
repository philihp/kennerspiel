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
import { complete, convert } from '../convert'

describe('commands/convert', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [['W'], ['C'], [], [], [], [], [], [], []],
      [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 1,
    peat: 0,
    penny: 10,
    clay: 0,
    wood: 0,
    grain: 10,
    sheep: 0,
    stone: 0,
    flour: 0,
    grape: 0,
    nickel: 10,
    malt: 0,
    coal: 0,
    book: 0,
    ceramic: 0,
    whiskey: 10,
    straw: 0,
    meat: 0,
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
      startingPlayer: 0,
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
      pointingBefore: 2,
      wood: 1,
      joker: 0,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('convert', () => {
    it('cannot convert undefined state', () => {
      expect(convert({})(undefined)).toBeUndefined()
    })
    it('accepts a noop', () => {
      const s1 = convert({})(s0)
      expect(s1).toMatchObject(s0)
    })
    it('converts nickel to pennies', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 1,
            penny: 1,
            wine: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = convert({ nickel: 1 })(s1)!
      expect(s2.players[0]).toMatchObject({
        nickel: 0,
        penny: 6,
        wine: 1,
      })
    })
    it('converts pennies to nickel', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 2,
            penny: 6,
            wine: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = convert({ penny: 5 })(s1)!
      expect(s2.players[0]).toMatchObject({
        nickel: 3,
        penny: 1,
        wine: 1,
      })
    })
    it('converts wine to coins', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 10,
            penny: 10,
            wine: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = convert({ wine: 3 })(s1)!
      expect(s2.players[0]).toMatchObject({
        nickel: 10,
        penny: 13,
        wine: 7,
      })
    })
    it('converts whiskey to coins', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 10,
            penny: 10,
            whiskey: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = convert({ whiskey: 3 })(s1)!
      expect(s2.players[0]).toMatchObject({
        nickel: 10,
        penny: 16,
        whiskey: 7,
      })
    })
    it('converts wine if needed to uptoken to nickel', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
            penny: 2,
            wine: 4,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = convert({ penny: 5 })(s1)!
      expect(s2.players[0]).toMatchObject({
        nickel: 1,
        penny: 0,
        wine: 1,
      })
    })
    it('converts whiskey if needed to uptoken to nickel', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
            penny: 2,
            whiskey: 4,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = convert({ penny: 5 })(s1)!
      expect(s2.players[0]).toMatchObject({
        nickel: 1,
        penny: 0,
        whiskey: 4,
      })
    })
  })

  describe('complete', () => {
    it('does not allow convert if nothing to convert', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
            penny: 0,
            grain: 0,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('allows convert if they have nickels', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 1,
            penny: 0,
            grain: 0,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['CONVERT'])
    })
    it('does not allow convert if they have four pennies', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
            penny: 4,
            grain: 0,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('allows convert if they have five pennies', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
            penny: 5,
            grain: 0,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['CONVERT'])
    })
    it('does not allow convert if they have grain', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
            penny: 0,
            grain: 1,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['CONVERT'])
    })
    it('does not allow convert if they have wine', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
            penny: 0,
            grain: 0,
            wine: 1,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['CONVERT'])
    })
    it('does not allow convert if they have whiskey', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
            penny: 0,
            grain: 0,
            wine: 0,
            whiskey: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['CONVERT'])
    })
    it('returns [] if weird partial', () => {
      const c0 = complete(s0)(['CONVERT', 'TWO', 'APPLES'])
      expect(c0).toStrictEqual([])
    })
  })
})
