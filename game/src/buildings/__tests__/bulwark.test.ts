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
import { bulwark, complete } from '../bulwark'

describe('buildings/bulwark', () => {
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
    book: 5,
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
  }

  describe('bulwark', () => {
    it('supports a noop with empty strings', () => {
      const s1 = bulwark('')(s0)!
      expect(s1).toBe(s0)
    })

    it('supports a noop with no params', () => {
      const s1 = bulwark()(s0)!
      expect(s1).toBe(s0)
    })

    it('goes through a happy path', () => {
      const s1 = bulwark('Bo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 4,
      })
      expect(s1.frame).toMatchObject({
        canBuyLandscape: s0.frame.canBuyLandscape,
        bonusActions: ['BUY_DISTRICT', 'BUY_PLOT'],
      })
    })
  })

  describe('complete', () => {
    it('offers a book, if the player has one', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            book: 4,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['Bo', ''])
    })
    it('offers noop if no books', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            book: 0,
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
      } as GameStatePlaying
      const c0 = complete(['Bo'])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('ignores more than one param', () => {
      const s1 = {
        ...s0,
      } as GameStatePlaying
      const c0 = complete(['Bo', 'Bo'])(s1)
      expect(c0).toStrictEqual([])
    })
  })
})
