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
import { buyDistrict, complete } from '../buyDistrict'

describe('commands/buyDistrict', () => {
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
    districtPurchasePrices: [2, 3, 4, 4, 5, 5, 6, 7, 8],
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
      frame: {
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

  describe('buyDistrict', () => {
    it('fails if overlapping', () => {
      expect(s0.players[0]).toMatchObject({
        nickel: 1,
        penny: 0,
        landscapeOffset: 0,
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
        ],
      })
      const s1 = buyDistrict({ side: 'HILLS', y: 0 })(s0)!
      expect(s1).toBeUndefined()
    })

    it('fails if no connection', () => {
      expect(s0.players[0]).toMatchObject({
        nickel: 1,
        penny: 0,
        landscapeOffset: 0,
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
        ],
      })
      const s1 = buyDistrict({ side: 'HILLS', y: -2 })(s0)!
      expect(s1).toBeUndefined()
    })

    it('handles undefined state', () => {
      const s1 = buyDistrict({ side: 'PLAINS', y: -1 })(undefined)
      expect(s1).toBeUndefined()
    })

    it('does not allow buying twice', () => {
      const s1 = buyDistrict({ side: 'HILLS', y: -1 })(s0)!
      expect(s1).toMatchObject({
        frame: {
          canBuyLandscape: false,
        },
      })
      const s2 = buyDistrict({ side: 'PLAINS', y: -2 })(s1)!
      expect(s2).toBeUndefined()
    })

    it('can buyDistrict to bottom', () => {
      const s1 = buyDistrict({ side: 'PLAINS', y: 2 })(s0)!
      expect(s1).toMatchObject({
        frame: {
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
        frame: {
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

    it('can buy a district for free, if as a bonus action', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          canBuyLandscape: false,
          bonusActions: [GameCommandEnum.BUY_DISTRICT, GameCommandEnum.BUY_PLOT],
        },
      }
      expect(s1.players[0]).toMatchObject({
        nickel: 1,
        penny: 0,
      })
      const s2 = buyDistrict({ side: 'PLAINS', y: 2 })(s1)!
      expect(s2.players[0]).toMatchObject({
        nickel: 1,
        penny: 0,
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          [[], [], ['P', 'LFO'], ['P'], ['P'], ['P'], ['H'], [], []],
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
      const s2 = buyDistrict({ side: 'PLAINS', y: 2 })(s1)!
      expect(s2).toMatchObject({
        frame: {
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_PLOT],
        },
        districtPurchasePrices: s1.districtPurchasePrices,
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
      const s2 = buyDistrict({ side: 'PLAINS', y: 2 })(s1)!
      expect(s2).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('offers to do it if they havent bought landscape yet', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['BUY_DISTRICT'])
    })
    it('doesnt offer if landscape already bought', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          canBuyLandscape: false,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('offers if there is a free bonus action to do so', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          canBuyLandscape: false,
          bonusActions: [GameCommandEnum.BUY_DISTRICT],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['BUY_DISTRICT'])
    })
    it('does not offer if there is no money', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            nickel: 0,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('offers if no money but has a bonusAction, because this indicates a free buy', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            nickel: 0,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          canBuyLandscape: false,
          bonusActions: [GameCommandEnum.BUY_DISTRICT],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['BUY_DISTRICT'])
    })
    it('does not offer if there are no districts left', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            nickel: 1,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
          bonusActions: [GameCommandEnum.BUY_DISTRICT],
        },
        districtPurchasePrices: [],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('gives rows in which a new district can live', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscapeOffset: 2,
            landscape: [
              [['W'], ['C'], ['P'], ['P'], ['P'], ['H'], ['H'], ['H'], ['M']],
              [['W'], ['C'], [], [], [], [], [], ['H'], ['.']],
              [['W'], ['C'], ['P', 'LPE'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LR1'], ['H'], ['M']],
              [['W'], ['C'], ['P'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['H', 'LR3'], ['H'], ['.']],
              [['W'], ['C'], [], [], [], [], [], [], []],
              [['W'], ['C'], [], [], [], [], [], [], []],
            ] as Tile[][],
            nickel: 5,
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          canBuyLandscape: true,
        },
        districtPurchasePrices: [],
      }
      const c0 = complete(s1)(['BUY_DISTRICT'])
      expect(c0).toStrictEqual(['-3', '-1', '2', '3'])
    })
  })
})
