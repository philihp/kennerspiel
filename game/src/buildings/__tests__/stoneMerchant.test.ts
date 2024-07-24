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
import { complete, stoneMerchant } from '../stoneMerchant'

describe('buildings/stoneMerchant', () => {
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
    peat: 10,
    penny: 10,
    clay: 10,
    wood: 10,
    grain: 10,
    sheep: 10,
    stone: 10,
    flour: 10,
    grape: 10,
    nickel: 10,
    malt: 10,
    coal: 10,
    book: 10,
    ceramic: 10,
    whiskey: 10,
    straw: 10,
    meat: 10,
    ornament: 10,
    bread: 10,
    wine: 10,
    beer: 10,
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
      pointingBefore: 0,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }
  describe('stoneMerchant', () => {
    it('goes through a happy path', () => {
      const s1 = stoneMerchant('ShShCo')(s0)!
      expect(s1.players[0]).toMatchObject({
        sheep: 8,
        coal: 9,
        stone: 12,
      })
    })

    it('does not give energy change', () => {
      const s1 = stoneMerchant('ShCo')(s0)!
      expect(s1.players[0]).toMatchObject({
        wood: 10,
        sheep: 9,
        coal: 9,
        stone: 11,
      })
    })
    it('does not give food change', () => {
      const s1 = stoneMerchant('GnCo')(s0)!
      expect(s1.players[0]).toMatchObject({
        wood: 10,
        grain: 9,
        coal: 9,
        stone: 10, // not even 2 food, gives you zero stone
      })
    })

    it('can be used up to 5 times', () => {
      const s1 = stoneMerchant('ShShShShShWoWoWoWoWo')(s0)!
      expect(s1.players[0]).toMatchObject({
        sheep: 5,
        wood: 5,
        stone: 15,
      })
    })

    it('max output is 5, but still consumes everything', () => {
      const s1 = stoneMerchant('ShShShShShShShWoWoWoWoWoWoWo')(s0)!
      expect(s1.players[0]).toMatchObject({
        sheep: 3,
        wood: 3,
        stone: 15,
      })
    })

    it('does not consume what it doesnt have', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], sheep: 0, wood: 0, stone: 0 }, ...s0.players.slice(1)],
      }
      const s2 = stoneMerchant('ShWo')(s1)!
      expect(s2).toBeUndefined()
    })
  })

  describe('complete', () => {
    const s1 = {
      ...s0,
      players: [
        {
          ...s0.players[0],
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
        },
        ...s0.players.slice(1),
      ],
    }
    it("returns [''] still if nothing to do", () => {
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('if only one way, returns that way', () => {
      const s2 = {
        ...s1,
        players: [
          {
            ...s1.players[0],
            sheep: 1,
            wood: 1,
          },
          ...s1.players.slice(1),
        ],
      }
      const c0 = complete([])(s2)
      expect(c0).toStrictEqual(['ShWo', ''])
    })
    it('if two ways if possible', () => {
      const s2 = {
        ...s1,
        players: [
          {
            ...s1.players[0],
            sheep: 2,
            wood: 2,
          },
          ...s1.players.slice(1),
        ],
      }
      const c0 = complete([])(s2)
      expect(c0).toStrictEqual(['ShShWoWo', 'ShWo', ''])
    })
    it('tries other goods', () => {
      const s2 = {
        ...s1,
        players: [
          {
            ...s1.players[0],
            sheep: 1,
            wood: 1,
            grain: 2,
          },
          ...s1.players.slice(1),
        ],
      }
      const c0 = complete([])(s2)
      expect(c0).toStrictEqual(['ShWo', 'GnGnWo', ''])
    })
    it('supports complexity', () => {
      const s2 = {
        ...s1,
        players: [
          {
            ...s1.players[0],
            sheep: 1,
            meat: 1,
            grain: 1,
            wood: 2,
            coal: 1,
          },
          ...s1.players.slice(1),
        ],
      }
      const c0 = complete([])(s2)
      expect(c0).toStrictEqual(['MtShGnCoWo', 'MtShCo', 'MtGnCo', 'MtCo', 'MtWoWo', 'MtCo', 'MtWo', 'ShCo', 'ShWo', ''])
    })
    it('does not go insane over a reasonably complex situation', () => {
      const s2 = {
        ...s1,
        players: [
          {
            ...s1.players[0],
            meat: 5,
            grain: 6,
            beer: 5,
            wood: 5,
            peat: 5,
            coal: 2,
            penny: 10,
          },
          ...s1.players.slice(1),
        ],
      }
      const c0 = complete([])(s2)
      // this is kind of a lot... but also, it should not crash us. If this takes too long, then we have problems.
      expect(c0).toHaveLength(355)
    })
    it('capped at 5 iterations', () => {
      const s2 = {
        ...s1,
        players: [
          {
            ...s1.players[0],
            sheep: 10,
            wood: 10,
          },
          ...s1.players.slice(1),
        ],
      }
      const c0 = complete([])(s2)
      // this is kind of a lot... but also, it should not crash us. If this takes too long, then we have problems.
      expect(c0).toStrictEqual(['ShShShShShWoWoWoWoWo', 'ShShShShWoWoWoWo', 'ShShShWoWoWo', 'ShShWoWo', 'ShWo', ''])
    })
  })
})
