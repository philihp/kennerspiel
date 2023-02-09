import { initialState } from '../../reducer'
import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { nextFrame } from '../frame'

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
    hops: 0,
    coal: 0,
    book: 0,
    pottery: 0,
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
      next: 2,
      startingPlayer: 0,
      settlementRound: SettlementRound.S,
      workContractCost: 1,
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
})
