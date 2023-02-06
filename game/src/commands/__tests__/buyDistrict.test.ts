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
import { buyDistrict } from '../buyDistrict'

describe('commands/buyDistrict', () => {
  describe('buyDistrict', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
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
      nickel: 1,
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
      districtPurchasePrices: [2, 3, 4, 4, 5, 5, 6, 7, 8],
      turn: {
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
    }

    it('can buyDistrict to top', () => {
      expect(s0.players[0]).toMatchObject({
        nickel: 1,
        penny: 0,
        landscapeOffset: 0,
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
        ],
      })
      const s1 = buyDistrict({ side: 'HILLS', y: -1 })(s0)!
      expect(s1).toMatchObject({
        turn: {
          canBuyLandscape: false,
        },
        districtPurchasePrices: [3, 4, 4, 5, 5, 6, 7, 8],
      })
      expect(s1.players[0]).toMatchObject({
        penny: 3,
        landscapeOffset: 1,
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
        ],
      })
    })

    it('handles undefined state', () => {
      const s1 = buyDistrict({ side: 'PLAINS', y: -1 })(undefined)
      expect(s1).toBeUndefined()
    })

    it('does not allow buying twice', () => {
      const s1 = buyDistrict({ side: 'HILLS', y: -1 })(s0)!
      expect(s1).toMatchObject({
        turn: {
          canBuyLandscape: false,
        },
      })
      const s2 = buyDistrict({ side: 'PLAINS', y: -2 })(s1)!
      expect(s2).toBeUndefined()
    })

    it('can buyDistrict to bottom', () => {
      const s1 = buyDistrict({ side: 'PLAINS', y: 2 })(s0)!
      expect(s1).toMatchObject({
        turn: {
          canBuyLandscape: false,
        },
        districtPurchasePrices: [3, 4, 4, 5, 5, 6, 7, 8],
      })
      expect(s1.players[0]).toMatchObject({
        penny: 3,
        landscapeOffset: 0,
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          [[], [], ['P', 'LFO'], ['P'], ['P'], ['P'], ['H'], [], []],
        ],
      })
    })

    it('can buy a district with a gap', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
              [['W'], ['C'], [], [], [], [], [], [], []],
              [['W'], ['C'], [], [], [], [], [], [], []],
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = buyDistrict({ side: 'PLAINS', y: 3 })(s1)!
      expect(s2).toMatchObject({
        turn: {
          canBuyLandscape: false,
        },
        districtPurchasePrices: [3, 4, 4, 5, 5, 6, 7, 8],
      })
      expect(s2.players[0]).toMatchObject({
        penny: 3,
        landscapeOffset: 0,
        landscape: [
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P'], ['P'], ['H'], [], []],
        ],
      })
    })
  })
})
