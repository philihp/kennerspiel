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
import { buyPlot } from '../buyPlot'

describe('commands/buyPlot', () => {
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
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
    neutralBuildingPhase: false,
  }

  describe('buyPlot', () => {
    it('handles undefined state', () => {
      expect(buyPlot({ side: 'MOUNTAIN', y: -1 })(undefined)).toBeUndefined()
    })

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
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ],
        landscapeOffset: 0,
      })
    })

    it('can buy a coastline plot at -1', () => {
      const s1 = buyPlot({ side: 'COAST', y: -1 })(s0)!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ],
        landscapeOffset: 1,
      })
    })

    it('can not buy a coastline plot at -2 because it isnt connected', () => {
      const s1 = buyPlot({ side: 'COAST', y: -2 })(s0)!
      expect(s1).toBeUndefined()
    })
    it('can buy a coastline plot at -2 if coast connected', () => {
      const connectedCoast = [
        [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      ] as Tile[][]
      const s1 = buyPlot({ side: 'COAST', y: -2 })({
        ...s0,
        players: [{ ...s0.players[0], landscape: connectedCoast }, ...s0.players.slice(1)],
      })!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ],
        landscapeOffset: 2,
      })
    })

    it('can buy a coastline plot at +1', () => {
      const s1 = buyPlot({ side: 'COAST', y: +1 })(s0)!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
        ],
        landscapeOffset: 0,
      })
    })

    it('can not buy a coastline plot at +2 because it isnt connected', () => {
      const s1 = buyPlot({ side: 'COAST', y: +2 })(s0)!
      expect(s1?.players?.[0]?.landscape).toBeUndefined()
    })
    it('can buy a coastline plot at +2 if coast connected', () => {
      const connectedCoast = [
        [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      ] as Tile[][]
      const s1 = buyPlot({ side: 'COAST', y: +2 })({
        ...s0,
        players: [{ ...s0.players[0], landscape: connectedCoast }, ...s0.players.slice(1)],
      })!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
        ],
        landscapeOffset: 0,
      })
    })

    //-----

    it('can buy a mountain plot at 0', () => {
      const s1 = buyPlot({ side: 'MOUNTAIN', y: 0 })(s0)!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
        ],
        landscapeOffset: 0,
      })
    })

    it('can buy a mountain plot at -1', () => {
      const s1 = buyPlot({ side: 'MOUNTAIN', y: -1 })(s0)!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [[], [], [], [], [], [], [], ['H'], ['M']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ],
        landscapeOffset: 1,
      })
    })

    it('can not buy a mountain plot at -2 because it isnt connected', () => {
      const s1 = buyPlot({ side: 'MOUNTAIN', y: -2 })(s0)!
      expect(s1).toBeUndefined()
    })
    it('can buy a mountain plot at -2 if coast connected', () => {
      const connectedMountain = [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
      ] as Tile[][]
      const s1 = buyPlot({ side: 'MOUNTAIN', y: -2 })({
        ...s0,
        players: [{ ...s0.players[0], landscape: connectedMountain }, ...s0.players.slice(1)],
      })!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [[], [], [], [], [], [], [], ['H'], ['M']],
          [[], [], [], [], [], [], [], ['H'], ['.']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
        ],
        landscapeOffset: 2,
      })
    })

    it('can buy a mountain plot at +1', () => {
      const s1 = buyPlot({ side: 'MOUNTAIN', y: +1 })(s0)!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']],
          [[], [], [], [], [], [], [], ['H'], ['.']],
        ],
        landscapeOffset: 0,
      })
    })

    it('can not buy a mountain plot at +2 because it isnt connected', () => {
      const s1 = buyPlot({ side: 'MOUNTAIN', y: +2 })(s0)!
      expect(s1?.players?.[0]?.landscape).toBeUndefined()
    })
    it('can buy a mountain plot at +2 if coast connected', () => {
      const connectedMountain = [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
      ] as Tile[][]
      const s1 = buyPlot({ side: 'MOUNTAIN', y: +2 })({
        ...s0,
        players: [{ ...s0.players[0], landscape: connectedMountain }, ...s0.players.slice(1)],
      })!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        canBuyLandscape: false,
      })
      expect(s1.players[0]).toMatchObject({
        penny: 99,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
          [[], [], [], [], [], [], [], ['H'], ['M']],
          [[], [], [], [], [], [], [], ['H'], ['.']],
        ],
        landscapeOffset: 0,
      })
    })
  })
})
