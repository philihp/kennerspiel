import { initialState } from '../../state'
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
import { bathhouse, complete } from '../bathhouse'

describe('buildings/bathhouse', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: ['LB2B'] as Clergy[],
    settlements: [],
    landscape: [
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1', 'PRIB'], [], []],
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2', 'LB1B'], ['P'], ['P', 'LB3'], [], []],
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
      next: 1,
      round: 1,
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

  describe('bathhouse', () => {
    it('follows happy path', () => {
      const s1 = bathhouse('Pn')(s0)!
      expect(s1.players[0]).toMatchObject({
        penny: 0,
        book: 1,
        ceramic: 1,
      })
      expect(s1.players[0].clergy).toContain('PRIB')
      expect(s1.players[0].clergy).toContain('LB1B')
      expect(s1.players[0].clergy).toContain('LB2B')
      expect(s1.players[0].landscape).toStrictEqual([
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ])
    })

    it('allows noop with undefined', () => {
      const s1 = bathhouse()(s0)!
      expect(s1).toBe(s0)
    })

    it('allows noop with empty string', () => {
      const s1 = bathhouse('')(s0)!
      expect(s1).toBe(s0)
    })

    it('will not move someone elses piece', () => {
      // how could this happen? i dunno, but why not just make sure it doesnt?
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P'], ['P', 'LFO', 'LB1R'], ['P', 'LFO'], ['P'], ['P', 'LB1', 'PRIB'], [], []],
              [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2', 'LB1B'], ['P'], ['P', 'LB3'], [], []],
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bathhouse('Pn')(s1)!
      expect(s2.players[0].clergy).toContain('PRIB')
      expect(s2.players[0].clergy).toContain('LB1B')
      expect(s2.players[0].clergy).toContain('LB2B')
      expect(s2.players[0].landscape).toStrictEqual([
        [[], [], ['P'], ['P', 'LFO', 'LB1R'], ['P', 'LFO'], ['P'], ['P', 'LB1'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ])
    })

    it('does not change array identity if nothing to change', () => {
      // this would only really happen if you work contract someone else, and have no clergy out
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: ['LB1B', 'LB2B', 'PRIB'] as Clergy[],
            landscape: [
              [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], [], []],
              [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = bathhouse()(s1)!
      expect(s1.players[0].clergy).toBe(s2.players[0].clergy)
      expect(s1.players[0].landscape).toBe(s2.players[0].landscape)
    })

    it('fails if no pennies', () => {
      const s1 = { ...s0, players: [{ ...s0.players[0], penny: 0 }, ...s0.players.slice(1)] }
      const s2 = bathhouse('Pn')(s1)!
      expect(s2).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('when no money, only noop', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('when money, allow offer', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 4,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['Pn', ''])
    })
  })
})
