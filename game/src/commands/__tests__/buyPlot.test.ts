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
    plotPurchasePrices: [2, 3, 4, 4, 5, 6],
    districtPurchasePrices: [1, 1],
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
        plotPurchasePrices: [3, 4, 4, 5, 6],
        frame: { canBuyLandscape: false },
      })
      expect(s1.players[0]).toMatchObject({
        penny: 98,
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
    it('suggests with buy_plot if they have enough money', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [2, 3, 4, 4, 5, 6],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['BUY_PLOT'])
    })
    it('does not suggest if not enough money', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [2, 3, 4, 4, 5, 6],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('does not suggest when they have already bought', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [2, 3, 4, 4, 5, 6],
        frame: {
          ...s0.frame,
          canBuyLandscape: false,
          bonusActions: [],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('suggests if they can buy for free', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [2, 3, 4, 4, 5, 6],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_PLOT],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['BUY_PLOT'])
    })
    it('does not suggest if there are no more', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_PLOT],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('suggests appropriate rows where this can happen', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // -2
              [['W'], ['C'], ['P'], ['P'], ['P'], ['H'], ['H'], [], []], // -1
              [[], [], /* */ ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']], // 0
              [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']], // 1
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // 2
            ] as Tile[][],
            landscapeOffset: 2,
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_PLOT],
        },
      }
      const c0 = complete(s1)(['BUY_PLOT'])
      expect(c0).toStrictEqual(['-4', '-2', '2', '3'])
    })
    it('suggests Y values that work', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // -2
              [['W'], ['C'], ['P'], ['P'], ['P'], ['H'], ['H'], [], []], // -1
              [[], [], /* */ ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']], // 0
              [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']], // 1
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // 2
            ] as Tile[][],
            landscapeOffset: 2,
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_PLOT],
        },
      }
      const c0 = complete(s1)(['BUY_PLOT'])
      expect(c0).toStrictEqual(['-4', '-2', '2', '3'])
    })
    it('suggests coast given a Y that works for only that', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // -2
              [['W'], ['C'], ['P'], ['P'], ['P'], ['H'], ['H'], [], []], // -1
              [[], [], /* */ ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']], // 0
              [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']], // 1
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // 2
            ] as Tile[][],
            landscapeOffset: 2,
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_PLOT],
        },
      }
      const c0 = complete(s1)(['BUY_PLOT', '3'])
      expect(c0).toStrictEqual(['COAST'])
    })
    it('suggests mountain given a Y that works for only that', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // -2
              [['W'], ['C'], ['P'], ['P'], ['P'], ['H'], ['H'], [], []], // -1
              [[], [], /* */ ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M']], // 0
              [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']], // 1
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // 2
            ] as Tile[][],
            landscapeOffset: 2,
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_PLOT],
        },
      }
      const c0 = complete(s1)(['BUY_PLOT', '2'])
      expect(c0).toStrictEqual(['MOUNTAIN'])
    })
    it('suggests mountain or coast given a Y that works for both', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], [], [], [], [], [], /* -------- */ ['H'], ['M']], // -2
              [['W'], ['C'], ['P'], ['P'], ['P'], ['H'], ['H'], ['H'], ['.']], // -1
              [[], [], /* */ ['P'], ['P'], ['P'], ['P'], ['P'], [], []], // 0
              [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []], // 1
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // 2
            ] as Tile[][],
            landscapeOffset: 2,
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_PLOT],
        },
      }
      const c0 = complete(s1)(['BUY_PLOT', '-4'])
      expect(c0).toStrictEqual(['COAST', 'MOUNTAIN'])
    })
    it('allows completion with a valid command', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [['W'], ['C'], [], [], [], [], [], /* -------- */ ['H'], ['M']], // -2
              [['W'], ['C'], ['P'], ['P'], ['P'], ['H'], ['H'], ['H'], ['.']], // -1
              [[], [], /* */ ['P'], ['P'], ['P'], ['P'], ['P'], [], []], // 0
              [['W'], ['C'], ['P'], ['P'], ['P'], ['P'], ['P'], [], []], // 1
              [['W'], ['C'], [], [], [], [], [], /* -------- */ [], []], // 2
            ] as Tile[][],
            landscapeOffset: 2,
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
        plotPurchasePrices: [],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_PLOT],
        },
      }
      const c0 = complete(s1)(['BUY_PLOT', '-4', 'COAST'])
      expect(c0).toStrictEqual([''])
    })
  })
})
