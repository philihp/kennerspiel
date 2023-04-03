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
import { buyPlot, complete } from '../buyPlot'

describe('commands/buyPlot', () => {
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
        frame: { canBuyLandscape: false },
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
        frame: { canBuyLandscape: false },
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
        frame: { canBuyLandscape: false },
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
        frame: { canBuyLandscape: false },
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
        frame: { canBuyLandscape: false },
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
    it('fails if trying to position an overlap', () => {
      const connectedCoast = [
        [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      ] as Tile[][]
      const s1 = buyPlot({ side: 'COAST', y: +1 })({
        ...s0,
        players: [{ ...s0.players[0], landscape: connectedCoast }, ...s0.players.slice(1)],
      })!
      expect(s1).toBeUndefined()
    })

    //-----

    it('can buy a mountain plot at 0', () => {
      const s1 = buyPlot({ side: 'MOUNTAIN', y: 0 })(s0)!
      expect(s1).toMatchObject({
        plotPurchasePrices: [1, 1, 1, 1, 1],
        frame: { canBuyLandscape: false },
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
        frame: { canBuyLandscape: false },
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
        frame: { canBuyLandscape: false },
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
        frame: { canBuyLandscape: false },
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
        frame: { canBuyLandscape: false },
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

    it('can buy a plot for free, if as a bonus action', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          canBuyLandscape: false,
          bonusActions: [GameCommandEnum.BUY_DISTRICT, GameCommandEnum.BUY_PLOT],
        },
      }
      const s2 = buyPlot({ side: 'MOUNTAIN', y: 0 })(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 100,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
        ],
        landscapeOffset: 0,
      })
    })
    it('consumes bonus action before paying with canBuyLandscape', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_DISTRICT, GameCommandEnum.BUY_PLOT],
        },
      }
      const s2 = buyPlot({ side: 'MOUNTAIN', y: 0 })(s1)!
      expect(s2).toMatchObject({
        frame: {
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_DISTRICT],
        },
        plotPurchasePrices: s1.plotPurchasePrices,
      })
    })

    it('cannot buy if already consumed', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          canBuyLandscape: false,
          bonusActions: [],
        },
      }
      const s2 = buyPlot({ side: 'MOUNTAIN', y: 0 })(s1)!
      expect(s2).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('stub', () => {
      const c0 = complete(s0, [])
      expect(c0).toStrictEqual([])
    })
  })
})
