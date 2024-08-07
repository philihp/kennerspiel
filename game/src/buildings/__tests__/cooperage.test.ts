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
import { cooperage, complete } from '../cooperage'

describe('buildings/cooperage', () => {
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
    wood: 3,
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
      pointingBefore: 8,
      joker: 4,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('cooperage', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = cooperage()(s0)
      expect(s1).toBeUndefined()
    })
    it('allows using with no input', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = cooperage()(s0)
      expect(s0).toBe(s1)
    })
    it('allows using with empty string', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = cooperage('')(s0)
      expect(s0).toBe(s1)
    })
    it('uses joker to get whiskey', () => {
      const s1 = cooperage('WoWoWo', 'Wh')(s0)!
      expect(s1.players[0]).toMatchObject({
        wood: 0,
        beer: 0,
        whiskey: 5,
      })
    })
    it('uses joker to get beer', () => {
      const s1 = cooperage('WoWoWo', 'Be')(s0)!
      expect(s1.players[0]).toMatchObject({
        wood: 0,
        beer: 5,
        whiskey: 0,
      })
    })
    it('fails if nothing specified', () => {
      const s1 = cooperage('WoWoWo', '')(s0)!
      expect(s1.players[0]).toMatchObject({
        wood: 0,
        beer: 0,
        whiskey: 0,
      })
    })
    it('prefers whiskey if both requested', () => {
      const s1 = cooperage('WoWoWo', 'BeWh')(s0)!
      expect(s1.players[0]).toMatchObject({
        wood: 0,
        beer: 0,
        whiskey: 5,
      })
    })
    it('noop if not enough wood', () => {
      const s1 = cooperage('WoWo', 'Wh')(s0)!
      expect(s1).toBe(s0)
    })
    describe('in a short game', () => {
      const s1 = {
        ...s0,
        config: {
          ...s0.config,
          length: 'short',
        },
      } as GameStatePlaying
      it('gives bonus whiskey', () => {
        const s2 = cooperage('WoWoWo', 'Wh')(s1)
        expect(s2?.players.map((p) => p.whiskey)).toStrictEqual([6, 1, 1])
        expect(s2?.players.map((p) => p.beer)).toStrictEqual([0, 0, 0])
      })
      it('gives bonus beer', () => {
        const s2 = cooperage('WoWoWo', 'Be')(s1)
        expect(s2?.players.map((p) => p.whiskey)).toStrictEqual([0, 0, 0])
        expect(s2?.players.map((p) => p.beer)).toStrictEqual([6, 1, 1])
      })
    })
  })

  describe('complete', () => {
    it('allows noop when not enough wood', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            wood: 2,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('allows spending wood when we have it', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            wood: 5,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['BeWoWoWo', 'WhWoWoWo', ''])
    })
  })
})
