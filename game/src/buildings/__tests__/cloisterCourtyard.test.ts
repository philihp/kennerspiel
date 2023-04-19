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
import { cloisterCourtyard, complete } from '../cloisterCourtyard'

describe('buildings/cloisterCourtyard', () => {
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
    clay: 11,
    wood: 11,
    grain: 11,
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
  describe('cloisterCourtyard', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = cloisterCourtyard()(s0)
      expect(s1).toBeUndefined()
    })
    it('goes through a happy path', () => {
      const s1 = cloisterCourtyard('ClWoGn', 'Sh')(s0)!
      expect(s1.players[0]).toMatchObject({
        clay: 10,
        wood: 10,
        grain: 10,
        sheep: 6,
      })
    })
    it('fails if two are the same', () => {
      const s1 = cloisterCourtyard('ClWoWo', 'Sh')(s0)!
      expect(s1).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('has no options if player doesnt have 3 unique things', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 0,
            wood: 0,
            clay: 0,
            peat: 1,
            penny: 1,
            sheep: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([])
    })
    it('shows all options of 3 unique goods', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 1,
            penny: 1,
            clay: 0,
            wood: 0,
            grain: 1,
            sheep: 0,
            stone: 0,
            flour: 0,
            grape: 0,
            nickel: 0,
            malt: 0,
            coal: 1,
            book: 0,
            ceramic: 1,
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
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([
        'PtPnGn',
        'PtPnCo',
        'PtPnCe',
        'PtGnCo',
        'PtGnCe',
        'PtCoCe',
        'PnGnCo',
        'PnGnCe',
        'PnCoCe',
        'GnCoCe',
      ])
    })
    it('second param is all of the things you can get', () => {
      const c0 = complete(['PtPnGn'])(s0)
      expect(c0).toStrictEqual(['Pt', 'Sh', 'Wo', 'Cl', 'Pn', 'Gn'])
    })
    it('no third param', () => {
      const c0 = complete(['PtPnGn', 'Cl'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('third param is a mistake', () => {
      const c0 = complete(['PtPnGn', 'Cl', 'Rq'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
