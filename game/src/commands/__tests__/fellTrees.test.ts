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
import { fellTrees } from '../fellTrees'

describe('commands/fellTrees', () => {
  describe('fellTrees', () => {
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
      frame: {
        id: 1,
        activePlayerIndex: 0,
        settling: false,
        extraRound: false,
        moveInRound: 1,
        round: 1,
        startingPlayer: 1,
        settlementRound: SettlementRound.S,
        nextUse: NextUseClergy.Any,
        canBuyLandscape: true,
        neutralBuildingPhase: false,
        mainActionUsed: false,
        bonusActions: [],
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
          [['W'], ['C'], ['P', 'LPE'], ['P'], ['P', 'LFO'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
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
    it('gives the active player joker-wood', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: true })(s0)!
      expect(s1.players[0].wood).toBe(3)
    })
  })
})
