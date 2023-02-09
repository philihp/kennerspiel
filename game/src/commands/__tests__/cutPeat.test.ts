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
import { cutPeat } from '../cutPeat'

describe('commands/cutPeat', () => {
  describe('cutPeat', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [['W'], ['C'], [], [], [], [], [], [], []],
        [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
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
        next: 1,
        startingPlayer: 1,
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
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
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
})
