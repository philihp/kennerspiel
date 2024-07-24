import { dissocPath } from 'ramda'
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
import { complete, grapevine } from '../grapevine'

describe('buildings/grapevine', () => {
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

  describe('grapevine', () => {
    it('can take grapes', () => {
      const s1 = grapevine()(s0)!
      expect(s1.rondel).toMatchObject({
        pointingBefore: 3,
        joker: 2,
        grape: 3,
      })
      expect(s1.players[0]).toMatchObject({
        grape: 3,
      })
    })

    it('can get grapes with bonus production in short game', () => {
      const s1 = {
        ...s0,
        config: {
          ...s0.config,
          length: 'short',
        },
      } as GameStatePlaying
      const s2 = grapevine()(s1)!
      expect(s2.players[0].grape).toBe(4)
      expect(s2.players[1].grape).toBe(1)
      expect(s2.players[2].grape).toBe(1)
    })

    it('can use the joker', () => {
      const s1 = grapevine('Jo')(s0)!
      expect(s1.rondel).toMatchObject({
        pointingBefore: 3,
        joker: 3,
        grape: 1,
      })
      expect(s1.players[0]).toMatchObject({
        grape: 2,
      })
    })

    it('can get grapes with joker and bonus production in short game', () => {
      const s1 = {
        ...s0,
        config: {
          ...s0.config,
          length: 'short',
        },
      } as GameStatePlaying
      const s2 = grapevine('Jo')(s1)!
      expect(s2.players[0].grape).toBe(3)
      expect(s2.players[1].grape).toBe(1)
      expect(s2.players[2].grape).toBe(1)
    })
  })

  describe('complete', () => {
    it('takes no parameters', () => {
      const c0 = complete([])(s0)
      expect(c0).toStrictEqual(['', 'Jo'])
    })
    it('does not allow Joker if undefined', () => {
      const s1 = dissocPath<GameStatePlaying>(['rondel', 'joker'], s0)
      const c1 = complete([])(s1)
      expect(c1).not.toContain('Jo')
    })
    it('complete if given a param', () => {
      const c0 = complete(['Jo'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('dont allow complete with two params', () => {
      const c0 = complete(['Jo', 'Gp'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
