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
import { falseLighthouse, complete } from '../falseLighthouse'

describe('buildings/falseLighthouse', () => {
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
      pointingBefore: 0,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [],
    districtPurchasePrices: [],
  }
  describe('falseLighthouse', () => {
    it('maintains an undefined state', () => {
      const s1 = falseLighthouse('Wh')(undefined)! as GameStatePlaying
      expect(s1).toBeUndefined()
    })

    it('gives a whiskey to the player', () => {
      const s1 = falseLighthouse('Wh')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 3,
        whiskey: 1,
        beer: 0,
      })
    })

    it('gives a beer to the player', () => {
      const s1 = falseLighthouse('Be')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 3,
        whiskey: 0,
        beer: 1,
      })
    })

    it('fails if empty string given', () => {
      const s1 = falseLighthouse()(s0)! as GameStatePlaying
      expect(s1).toBeUndefined()
    })

    it('fails if nothing given', () => {
      const s1 = falseLighthouse('')(s0)! as GameStatePlaying
      expect(s1).toBeUndefined()
    })

    it('fails if wrong thing given', () => {
      const s1 = falseLighthouse('Wn')(s0)! as GameStatePlaying
      expect(s1).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('takes no parameters', () => {
      const c0 = complete([])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('does not complete anything with a param', () => {
      const c0 = complete([''])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
