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
import { slaughterhouse, complete } from '../slaughterhouse'

describe('buildings/slaughterhouse', () => {
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
    sheep: 10,
    stone: 0,
    flour: 0,
    grape: 0,
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
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('slaughterhouse', () => {
    it('goes through a happy path', () => {
      const s1 = slaughterhouse('ShShShSwSwSw')(s0)!
      expect(s1.players[0]).toMatchObject({
        sheep: 7,
        straw: 2,
        meat: 3,
      })
    })

    it('consumes everything if not enough straw', () => {
      const s1 = slaughterhouse('ShShShSwSw')(s0)!
      expect(s1.players[0]).toMatchObject({
        sheep: 7,
        straw: 3,
        meat: 2,
      })
    })

    it('consumes everything if not enough sheep', () => {
      const s1 = slaughterhouse('ShShSwSwSw')(s0)!
      expect(s1.players[0]).toMatchObject({
        sheep: 8,
        straw: 2,
        meat: 2,
      })
    })
  })

  describe('complete', () => {
    it('takes no parameters', () => {
      const c0 = complete([])(s0)
      expect(c0).toStrictEqual(['ShShShShShSwSwSwSwSw', 'ShShShShSwSwSwSw', 'ShShShSwSwSw', 'ShShSwSw', 'ShSw', ''])
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
