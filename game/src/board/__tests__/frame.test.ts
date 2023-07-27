import { initialState } from '../../state'
import {
  BuildingEnum,
  GameCommandEnum,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { allowFreeUsageToNeighborsOf, nextFrame, oncePerFrame } from '../frame'
import { gameEnd } from '../state'

describe('board/frame', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 0,
    peat: 0,
    penny: 100,
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
      pointingBefore: 0,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
    frame: {
      round: 1,
      next: 2,
      startingPlayer: 0,
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

  describe('gameEnd', () => {
    it('retains undefined state', () => {
      const s1 = gameEnd(undefined)!
      expect(s1).toBeUndefined()
    })

    it('retain everything about previous state but set status to finished', () => {
      const s1 = gameEnd(s0)!
      expect(s1).toMatchObject({
        ...s0,
        status: GameStatusEnum.FINISHED,
      })
    })
  })

  describe('oncePerFrame', () => {
    it('consumes the main action if still true', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: false,
        },
      }
      const s2 = oncePerFrame(GameCommandEnum.FELL_TREES)(s1)!
      expect(s2).toBeDefined()
      expect(s2.frame.mainActionUsed).toBeTruthy()
    })
    it('removes command from bonus actions', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          // this could result from using the Calefactory,
          // or the Bulwark in the case of buying landscape
          // but I want to allow for a generalized "these actions are still allowed"
          bonusActions: [GameCommandEnum.FELL_TREES, GameCommandEnum.CUT_PEAT],
        },
      }
      const s2 = oncePerFrame(GameCommandEnum.FELL_TREES)(s1)!
      expect(s2).toBeDefined()
      expect(s2.frame.bonusActions).toStrictEqual([GameCommandEnum.CUT_PEAT])
    })
    it('prefer to use mainAction, if it is available', () => {
      // hard to imagine a situation where this happens, but if it does, i want to
      // assume that the bonusAction will be consumed first
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: false,
          bonusActions: [GameCommandEnum.BUILD],
        },
      }
      const s2 = oncePerFrame(GameCommandEnum.BUILD)(s1)!
      expect(s2).toBeDefined()
      expect(s2.frame.mainActionUsed).toBeFalsy()
      expect(s2.frame.bonusActions).toStrictEqual([])
    })
    it('only removes one copy of the command', () => {
      const s1: GameStatePlaying = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          // this is a bit of future proofing, since no existing buildings would
          // give you a way of getting multiple bonus runs of the same command, but
          // it is possible that a building might say "you can build twice", and I
          // want to be able to express that without a big overhaul.
          bonusActions: [GameCommandEnum.BUILD, GameCommandEnum.CUT_PEAT, GameCommandEnum.BUILD],
        },
      }
      const s2 = oncePerFrame(GameCommandEnum.BUILD)(s1)!
      expect(s2).toBeDefined()
      expect(s2.frame.bonusActions).toHaveLength(2)
      expect(s2.frame.bonusActions).toContain(GameCommandEnum.BUILD)
      expect(s2.frame.bonusActions).toContain(GameCommandEnum.CUT_PEAT)
    })
  })

  describe('nextFrame', () => {
    describe('3 player long', () => {
      const s1: GameStatePlaying = {
        ...s0,
        config: {
          country: 'france',
          players: 3,
          length: 'long',
        },
      }

      it('retains undefined state on nextFrame', () => {
        const s = nextFrame(undefined)!
        expect(s).toBeUndefined()
      })

      it('advances through rounds', () => {
        let s = s1
        // Round 01
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 02
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 03
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 04
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 05
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Settlement A
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!

        // Round 06
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 07
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 08
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 09
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 10
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Settlement B
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          settlementRound: 'B',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          settlementRound: 'B',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          settlementRound: 'B',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!

        // Round 11
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 12
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 13
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 14
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Settlement C
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          settlementRound: 'C',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          settlementRound: 'C',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          settlementRound: 'C',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!

        // Round 15
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 16
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 17
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 18
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 19
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Settlement D
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          settlementRound: 'D',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          settlementRound: 'D',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          settlementRound: 'D',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!

        // Round 20
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 21
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 22
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 23
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 1,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Round 24
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 0,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 1,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 2,
          currentPlayerIndex: 2,
          bonusRoundPlacement: false,
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Bonus Round
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          bonusRoundPlacement: true,
          settlementRound: 'D',
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          bonusRoundPlacement: true,
          settlementRound: 'D',
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          bonusRoundPlacement: true,
          settlementRound: 'D',
          mainActionUsed: false,
          bonusActions: [],
        })
        s = nextFrame(s)!

        // Settlement D
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 0,
          settlementRound: 'E',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 1,
          settlementRound: 'E',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
        expect(s.frame).toMatchObject({
          startingPlayer: 0,
          currentPlayerIndex: 2,
          settlementRound: 'E',
          mainActionUsed: true,
          bonusActions: ['SETTLE'],
        })
        s = nextFrame(s)!
      })
    })
  })

  describe('allowFreeUsageToNeighborsOf', () => {
    it('only allows building neighbors', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'G01'], ['P'], ['H', 'F10'], ['M']],
              [[], [], ['P'], ['P', 'SB1'], ['P', 'F09'], ['P', 'F03'], ['H'], ['H', 'F05'], ['.']],
              [[], [], ['P'], ['P', 'LFO'], ['P', 'F04'], ['P', 'LFO'], ['P'], [], []],
            ],
          },
          ...s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = allowFreeUsageToNeighborsOf(BuildingEnum.CloisterGarden)(s1)!
      expect(s2.frame.usableBuildings).toHaveLength(2)
      expect(s2.frame.usableBuildings).toContain('F03')
      expect(s2.frame.usableBuildings).toContain('F04')
    })
  })
})
