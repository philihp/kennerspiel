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
import { cloisterChurch, complete } from '../cloisterChurch'

describe('buildings/cloisterChurch', () => {
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
    bread: 3,
    wine: 4,
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

  describe('cloisterChurch', () => {
    it('works twice', () => {
      const s1 = cloisterChurch('BrBrWnWn')(s0)!
      expect(s1.players[0]).toMatchObject({
        bread: 1,
        wine: 2,
        reliquary: 2,
      })
    })

    it('works once', () => {
      const s1 = cloisterChurch('BrWn')(s0)!
      expect(s1.players[0]).toMatchObject({
        bread: 2,
        wine: 3,
        reliquary: 1,
      })
    })

    it('works once with extra just consumed', () => {
      const s1 = cloisterChurch('BrWnWn')(s0)!
      expect(s1.players[0]).toMatchObject({
        bread: 2,
        wine: 2,
        reliquary: 1,
      })
    })

    it('works with nothing, and gives nothing', () => {
      const s1 = cloisterChurch('')(s0)!
      expect(s1.players[0]).toMatchObject({
        bread: 3,
        wine: 4,
        reliquary: 0,
      })
    })
  })

  describe('complete', () => {
    it('offers up to the minimum of bread and wine', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            bread: 3,
            wine: 2,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['BrBrWnWn', 'BrWn', ''])
    })
    it('offers up to the minimum of bread and wine, and max 2 iterations', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            bread: 1,
            wine: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['BrWn', ''])
    })
    it('complete if given a param', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            bread: 3,
            wine: 2,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(['BrWn'])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('dont allow complete with two params', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(['Br', 'Wn'])(s1)
      expect(c0).toStrictEqual([])
    })
  })
})
