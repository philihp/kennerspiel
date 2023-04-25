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
import { winery, complete } from '../winery'

describe('buildings/winery', () => {
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
    sheep: 10,
    stone: 0,
    flour: 0,
    grape: 10,
    nickel: 0,
    malt: 0,
    coal: 0,
    book: 0,
    ceramic: 0,
    whiskey: 0,
    straw: 5,
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

  describe('winery', () => {
    it('goes through a happy path', () => {
      const s1 = winery('GpGpGpWn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        grape: 7,
        wine: 12,
        nickel: 1,
        penny: 12,
      })
    })

    it('convert to wine then immediately to grape', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], grape: 1, wine: 0, penny: 0, nickel: 0 }, ...s0.players.slice(1)],
      }

      const s2 = winery('GpWn')(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        grape: 0,
        wine: 0,
        penny: 2,
        nickel: 1,
      })
    })

    it('can skip grape part', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], grape: 0, wine: 1, penny: 0, nickel: 0 }, ...s0.players.slice(1)],
      }
      const s2 = winery('Wn')(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        wine: 0,
        penny: 2,
        nickel: 1,
      })
    })

    it('can have a noop', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], grape: 0, wine: 0, penny: 0, nickel: 0 }, ...s0.players.slice(1)],
      }
      const s2 = winery()(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        wine: 0,
        penny: 0,
        nickel: 0,
      })
    })
  })

  describe('complete', () => {
    it('if no grape, no wine, only noop', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grape: 0,
            wine: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('only wine, it can be sold', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grape: 0,
            wine: 3,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['Wn', ''])
    })
    it('if no wine, no solo-wine sale but ferment any amount', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grape: 5,
            wine: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([
        'GpGpGpGpGpWn',
        'GpGpGpGpGp',
        'GpGpGpGpWn',
        'GpGpGpGp',
        'GpGpGpWn',
        'GpGpGp',
        'GpGpWn',
        'GpGp',
        'GpWn',
        'Gp',
        '',
      ])
    })

    it('complete if given a param', () => {
      const c0 = complete(['GpWn'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('dont allow complete with two params', () => {
      const c0 = complete(['Gp', 'Wn'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
