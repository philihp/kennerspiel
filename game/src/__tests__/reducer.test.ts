import { initialState, reducer } from '../reducer'
import { GameStatePlaying, GameStatusEnum, NextUseClergy, PlayerColor, SettlementRound, Tableau, Tile } from '../types'

describe('reducer', () => {
  describe('initialState', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      ] as Tile[][],
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
      activePlayerIndex: 0,
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 0,
      },
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
      plotPurchasePrices: [1],
      districtPurchasePrices: [1],
      neutralBuildingPhase: false,
    }

    it('exposes an initial state', () => {
      expect.assertions(1)
      expect(initialState).toBeDefined()
    })

    it('handles unfound commands', () => {
      expect(() => reducer(s0, ['FOFOFOFOFOFO'])).toThrow()
    })

    it('calls buyDistrict', () => {
      const s1 = reducer(s0, ['BUY_DISTRICT', '-1', 'HILLS'])! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ],
      })
    })

    it('calls buyPlot', () => {
      const s1 = reducer(s0, ['BUY_PLOT', '0', 'COAST'])! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        landscape: [
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ],
      })
    })
  })
})
