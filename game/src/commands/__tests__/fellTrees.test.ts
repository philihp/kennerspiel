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
      activePlayerIndex: 0,
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
      settling: false,
      extraRound: false,
      moveInRound: 1,
      round: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
      buildings: [],
      nextUse: NextUseClergy.Any,
      canBuyLandscape: true,
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
      neutralBuildingPhase: false,
      mainActionUsed: false,
      bonusActions: [],
    }

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
    // it('wont fell trees where there are no trees', () => {
    //   expect.assertions(2)
    //   const s0 = initialState
    //   const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
    //   const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
    //   expect(s2.players?.[0].landscape).toStrictEqual([
    //     [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
    //     [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
    //   ])
    //   const s3 = fellTrees({ row: 0, col: 0, useJoker: false })(s2)
    //   expect(s3).toBeUndefined()
    // })
    // it('moves up the joker', () => {
    //   expect.assertions(2)
    //   const s0 = initialState
    //   const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
    //   const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
    //   const s3 = fellTrees({ row: 0, col: 1, useJoker: true })(s2)!
    //   expect(s3.rondel.joker).toBe(1)
    //   expect(s3.rondel.wood).toBe(0)
    // })
    // it('moves up the wood token', () => {
    //   expect.assertions(2)
    //   const s0 = initialState
    //   const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
    //   const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
    //   const s3 = fellTrees({ row: 0, col: 1, useJoker: false })(s2)!
    //   expect(s3.rondel.joker).toBe(0)
    //   expect(s3.rondel.wood).toBe(1)
    // })
    // it('gives the active player wood', () => {
    //   expect.assertions(6)
    //   const s0 = initialState
    //   const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
    //   const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
    //   expect(s2.players?.[0].wood).toBe(1)
    //   expect(s2.players?.[1].wood).toBe(1)
    //   expect(s2.players?.[2].wood).toBe(1)
    //   const s3 = fellTrees({ row: 0, col: 1, useJoker: false })(s2)!
    //   expect(s3.players?.[0].wood).toBe(3)
    //   expect(s2.players?.[1].wood).toBe(1)
    //   expect(s2.players?.[2].wood).toBe(1)
    // })
  })
})
