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
import { complete, cutPeat } from '../cutPeat'

describe('commands/cutPeat', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [['W'], ['C'], [], [], [], [], [], [], []],
      [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LPE'], ['P'], ['P'], [], []],
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
    config: {
      country: 'france',
      players: 3,
      length: 'long',
    },
    rondel: {
      pointingBefore: 2,
      joker: 0,
      peat: 1,
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

  describe('cutPeat', () => {
    it('retains undefined state', () => {
      const s1 = cutPeat({ row: 0, col: 0, useJoker: false })(undefined)
      expect(s1).toBeUndefined()
    })
    it('wont go if main action already used', () => {
      const s1 = { ...s0, frame: { ...s0.frame, mainActionUsed: true } }
      const s2 = cutPeat({ row: 0, col: 0, useJoker: false })(s1)!
      expect(s2).toBeUndefined()
    })
    it('if peat not on rondel, keeps token off but allows with zero peat', () => {
      const s1 = { ...s0, rondel: { pointingBefore: 0, peat: undefined } }
      expect(s1.players[0].peat).toBe(0)
      expect(s1.rondel.peat).toBeUndefined()
      const s2 = cutPeat({ row: 0, col: 0, useJoker: false })(s1)!
      expect(s2.players[0].peat).toBe(0)
      expect(s2.rondel.peat).toBeUndefined()
    })

    it('removes the peat bog', () => {
      const s1 = cutPeat({ row: 0, col: 0, useJoker: false })(s0)!
      expect(s1.players[0]).toMatchObject({
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LPE'], ['P'], ['P'], [], []],
        ],
      })
    })
    it('wont cut peat where there are no peat bog', () => {
      const s1 = cutPeat({ row: 0, col: 1, useJoker: false })(s0)!
      expect(s1).toBeUndefined()
    })
    it('moves up the joker', () => {
      const s1 = cutPeat({ row: 0, col: 0, useJoker: true })(s0)!
      expect(s1.rondel.joker).toBe(2)
      expect(s1.rondel.peat).toBe(1)
    })
    it('moves up the peat token', () => {
      const s1 = cutPeat({ row: 0, col: 0, useJoker: false })(s0)!
      expect(s1.rondel.joker).toBe(0)
      expect(s1.rondel.peat).toBe(2)
    })
    it('gives the active player peat', () => {
      const s1 = cutPeat({ row: 0, col: 0, useJoker: false })(s0)!
      expect(s1.players[0].peat).toBe(2)
    })
    it('gives the active player joker-peat', () => {
      const s1 = cutPeat({ row: 0, col: 0, useJoker: true })(s0)!
      expect(s1.players[0].peat).toBe(3)
    })
  })

  describe('complete', () => {
    it('returns CUT_PEAT if no partial and active player has forest', () => {
      const c0 = complete(s0)([])
      expect(c0).toStrictEqual(['CUT_PEAT'])
    })
    it('returns [] if active player has no moor', () => {
      const p1 = {
        ...p0,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P'], ['P'], ['P'], [], []],
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
    it('returns CUT_PEAT if frame has already consumed action, but allowed via bonus actions', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [GameCommandEnum.CUT_PEAT],
        },
      } as GameStatePlaying
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['CUT_PEAT'])
    })
    it('if partial in CUT_PEAT, returns a list of locations', () => {
      const c0 = complete(s0)([GameCommandEnum.CUT_PEAT])
      expect(c0).toStrictEqual(['0 0', '0 1', '2 1'])
    })
    it('if partial in CUT_PEAT has row, give cols for that row', () => {
      const c0 = complete(s0)([GameCommandEnum.CUT_PEAT, '0'])
      expect(c0).toStrictEqual(['0', '1'])
    })
    it('if CUT_PEAT at a location, give empty string response', () => {
      const c0 = complete(s0)([GameCommandEnum.CUT_PEAT, '0', '1'])
      expect(c0).toStrictEqual(['', 'Jo'])
    })
    it('if CUT_PEAT at a location with joker, give empty string response', () => {
      const c0 = complete(s0)([GameCommandEnum.CUT_PEAT, '0', '1', 'Jo'])
      expect(c0).toStrictEqual([''])
    })
    it('if CUT_PEAT not at a location, dont indicate this can be submitted', () => {
      const c0 = complete(s0)([GameCommandEnum.CUT_PEAT, '0', '5'])
      expect(c0).toStrictEqual([])
    })
  })
})
