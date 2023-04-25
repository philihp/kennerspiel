import { initialState } from '../../state'
import {
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { grandManor, complete } from '../grandManor'

describe('buildings/grandManor', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: ['PRIB'] as Clergy[],
    settlements: [],
    landscape: [
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
      [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3', 'LB2B'], [], []],
      [['W'], ['C', 'G26', 'LB1B'], [], [], [], [], []],
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
    nickel: 0,
    malt: 0,
    coal: 0,
    book: 0,
    ceramic: 0,
    whiskey: 1,
    straw: 0,
    meat: 0,
    ornament: 0,
    bread: 0,
    wine: 0,
    beer: 0,
    reliquary: 0,
  }
  const p1: Tableau = {
    color: PlayerColor.Red,
    clergy: ['LB2R'] as Clergy[],
    settlements: [],
    landscape: [
      [[], [], [], [], [], [], [], ['H'], ['M', 'G28', 'PRIR']],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], ['H', 'F27'], ['.']],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3', 'LB1R'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 1,
    peat: 0,
    penny: 0,
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
  const p2: Tableau = {
    color: PlayerColor.Green,
    clergy: ['LB1G', 'LG2G'] as Clergy[],
    settlements: [],
    landscape: [
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'G19', 'PRIG'], ['H'], ['H'], [], []],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LG1'], [], []],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2'], ['P'], ['P', 'LG3'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 1,
    peat: 0,
    penny: 0,
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
    config: {
      country: 'france',
      players: 3,
      length: 'long',
    },
    rondel: {
      pointingBefore: 3,
      grape: 1,
      joker: 2,
    },
    wonders: 0,
    players: [p0, p1, p2],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('grandManor', () => {
    it('can take whiskey', () => {
      const s1 = grandManor('Wh')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        whiskey: 0,
      })
      expect(s1.frame.nextUse).toBe('free')
      expect(s1.frame.usableBuildings?.sort()).toStrictEqual(['LB3', 'G26', 'LR3', 'G28', 'G19'].sort())
    })
  })

  describe('complete', () => {
    it('suggests Wh if player has it', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            whiskey: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([], s1)
      expect(c0).toStrictEqual(['Wh', ''])
    })
    it('still allows noop if no whiskey', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            whiskey: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([], s1)
      expect(c0).toStrictEqual([''])
    })
    it('suggets finish command if one param', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            whiskey: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete(['Wn'], s1)
      expect(c0).toStrictEqual([''])
    })
    it('suggests nothing if more than one param', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            whiskey: 2,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete(['Wn', 'Wn'], s1)
      expect(c0).toStrictEqual([])
    })
  })
})
