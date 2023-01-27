import { initialState } from '../../reducer'
import {
  GameStatePlaying,
  GameStatusEnum,
  LandEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
} from '../../types'
import { buyPlot } from '../buyPlot'

describe('commands/buyPlot', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [[], [], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [], []],
      [[], [], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [], []],
    ],
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
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
    neutralBuildingPhase: false,
  }

  describe('buyPlot', () => {
    it('starts out with a buffer on the left', () => {
      expect(s0.players[0]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ],
      })
    })

    it('can buy a coastline plot at 0', () => {
      const s1 = buyPlot({ side: 'COAST', y: 0 })(s0)!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      // expect(s1.players[0]).toMatchObject({
      //   penny: 99,
      //   landscape: [
      //     [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P']],
      //     [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P']],
      //   ],
      //   landscapeOffset: 0,
      // })
    })
  })
})
