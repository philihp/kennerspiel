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
import { complete, fellTrees } from '../fellTrees'

describe('commands/fellTrees', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [['W'], ['C'], [], [], [], [], [], [], []],
      [['W'], ['C'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P', 'LFO'], ['P'], ['P'], ['P', 'LFO'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 1,
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
      pointingBefore: 2,
      wood: 1,
      joker: 0,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('fellTrees', () => {
    it('retains undefined state', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: false })(undefined)
      expect(s1).toBeUndefined()
    })
    it('wont go if main action already used', () => {
      const s1 = { ...s0, frame: { ...s0.frame, mainActionUsed: true } }
      const s2 = fellTrees({ row: 0, col: 1, useJoker: false })(s1)!
      expect(s2).toBeUndefined()
    })
    it('if wood not on rondel, keeps wood off but allows with zero wood', () => {
      const s1 = { ...s0, rondel: { pointingBefore: 0, wood: undefined } }
      const s2 = fellTrees({ row: 0, col: 1, useJoker: false })(s1)!
      expect(s2.rondel.wood).toBeUndefined()
      expect(s2.players[0].wood).toBe(0)
    })
    it('removes the forest', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: false })(s0)!
      expect(s1.players[0]).toMatchObject({
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LMO'], ['P'], ['P', 'LFO'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P'], ['P'], ['P', 'LFO'], [], []],
        ],
      })
    })
    it('wont fell trees where there are no trees', () => {
      const s1 = fellTrees({ row: 0, col: 0, useJoker: false })(s0)!
      expect(s1).toBeUndefined()
    })
    it('moves up the joker', () => {
      expect(s0.rondel).toMatchObject({
        joker: 0,
        wood: 1,
      })
      const s1 = fellTrees({ row: 0, col: 1, useJoker: true })(s0)!
      expect(s1.rondel).toMatchObject({
        joker: 2,
        wood: 1,
      })
    })
    it('moves up the wood token', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: false })(s0)!
      expect(s1.rondel.joker).toBe(0)
      expect(s1.rondel.wood).toBe(2)
    })
    it('gives the active player wood', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: false })(s0)!
      expect(s1.players[0].wood).toBe(2)
    })
    it('fails if in bonus round', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          bonusRoundPlacement: true,
        },
      }
      const s2 = fellTrees({ row: 0, col: 1, useJoker: false })(s1)!
      expect(s2).toBeUndefined()
    })
    it('gives the active player joker-wood', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: true })(s0)!
      expect(s1.players[0].wood).toBe(3)
    })
  })

  describe('complete', () => {
    it('returns FELL_TREES if no partial and active player has forest', () => {
      const c0 = complete(s0)([])
      expect(c0).toStrictEqual(['FELL_TREES'])
    })
    it('returns [] if bonus round placement', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          bonusRoundPlacement: true,
        },
      }
      const c1 = complete(s1)([])
      expect(c1).toStrictEqual([])
    })
    it('returns [] if active player has no forest', () => {
      const p1 = {
        ...p0,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C', 'F03'], ['P', 'LMO'], ['P'], ['P'], ['P'], ['P', 'LB1'], [], []],
          [[], [], ['P', 'LMO'], ['P'], ['P'], ['P'], ['P'], [], []],
        ] as Tile[][],
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1],
      } as GameStatePlaying
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('returns [] if frame has already consumed action', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
        },
      } as GameStatePlaying
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('returns FELL_TREES if frame has already consumed action, but allowed via bonus actions', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [GameCommandEnum.FELL_TREES],
        },
      } as GameStatePlaying
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['FELL_TREES'])
    })
    it('if partial in FELL_TREES, returns a list of locations', () => {
      const c0 = complete(s0)([GameCommandEnum.FELL_TREES])
      expect(c0).toStrictEqual(['1 0', '2 0', '1 1', '4 1'])
    })
    it('if partial in FELL_TREES has row, give cols for that row', () => {
      const c0 = complete(s0)([GameCommandEnum.FELL_TREES, '2'])
      expect(c0).toStrictEqual(['0'])
    })
    it('if FELL_TREES at a location, give empty string response', () => {
      const c0 = complete(s0)([GameCommandEnum.FELL_TREES, '2', '0'])
      expect(c0).toStrictEqual(['', 'Jo'])
    })
    it('if FELL_TREES and Joker at a location, give empty string response', () => {
      const c0 = complete(s0)([GameCommandEnum.FELL_TREES, '2', '0', 'Jo'])
      expect(c0).toStrictEqual([''])
    })
    it('if FELL_TREES not at a location, dont indicate this can be submitted', () => {
      const c0 = complete(s0)([GameCommandEnum.FELL_TREES, '0', '5'])
      expect(c0).toStrictEqual([])
    })
  })
})
