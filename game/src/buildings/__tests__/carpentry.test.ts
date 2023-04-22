import { initialState } from '../../state'
import {
  GameCommandEnum,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { carpentry, complete } from '../carpentry'

describe('buildings/carpentry', () => {
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
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }
  describe('carpentry', () => {
    it('goes through a happy path', () => {
      const s1 = carpentry(0, 2)(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P', 'LFO'], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        ],
      })
      expect(s1.frame?.bonusActions).toContain(GameCommandEnum.BUILD)
    })
  })

  describe('complete', () => {
    it('completes with all of the forest locations', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P'], ['P'], ['P'], [], []],
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([], s1)
      expect(c0).toStrictEqual(['1 0', '1 1', '2 1', ''])
    })
    it('still lets you use it if there are no forests to take down', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P'], ['P', 'LPE'], ['P'], ['P'], ['P', 'LG1'], [], []],
              [[], [], ['P'], ['P', 'LPE'], ['P', 'LG2'], ['P'], ['P', 'LG3'], [], []],
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('gives rows if given a column', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P'], ['P'], ['P'], [], []],
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(['1'], s1)
      expect(c0).toStrictEqual(['0', '1'])
    })
    it('gives no rows if column is whack', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P'], ['P'], ['P'], [], []],
              [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(['0'], s1)
      expect(c0).toStrictEqual([])
    })
  })
})
