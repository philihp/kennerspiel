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
import { complete, quarry } from '../quarry'

describe('buildings/quarry', () => {
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
      stone: 1,
      joker: 2,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('quarry', () => {
    it('can take stones', () => {
      const s1 = quarry()(s0)! as GameStatePlaying
      expect(s1.rondel).toMatchObject({
        pointingBefore: 3,
        joker: 2,
        stone: 3,
      })
      expect(s1.players[0]).toMatchObject({
        stone: 3,
      })
    })

    it('has bonus production in short 3/4 game', () => {
      const s1 = {
        ...s0,
        config: {
          ...s0.config,
          length: 'short',
        },
      } as GameStatePlaying
      const s2 = quarry()(s1)! as GameStatePlaying
      expect(s2.rondel).toMatchObject({
        pointingBefore: 3,
        joker: 2,
        stone: 3,
      })
      expect(s2.players[0].stone).toBe(4)
      expect(s2.players[1].stone).toBe(1)
      expect(s2.players[2].stone).toBe(1)
    })

    it('can use the joker', () => {
      const s1 = quarry('Jo')(s0)! as GameStatePlaying
      expect(s1.rondel).toMatchObject({
        pointingBefore: 3,
        joker: 3,
        stone: 1,
      })
      expect(s1.players[0]).toMatchObject({
        stone: 2,
      })
    })
  })

  describe('complete', () => {
    it('takes no parameters', () => {
      const c0 = complete([])(s0)
      expect(c0).toStrictEqual(['', 'Jo'])
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
