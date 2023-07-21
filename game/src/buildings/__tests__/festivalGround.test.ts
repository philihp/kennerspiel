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
import { festivalGround, complete } from '../festivalGround'

describe('buildings/festivalGround', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: ['PRIB'] as Clergy[],
    settlements: [],
    landscape: [
      [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'G41'], ['H', 'LB1'], [], []],
      [['W'], ['C'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G01'], ['P', 'LB3', 'LB2B'], [], []],
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
    whiskey: 0,
    straw: 0,
    meat: 0,
    ornament: 0,
    bread: 0,
    wine: 0,
    beer: 1,
    reliquary: 0,
  }
  const p1: Tableau = {
    color: PlayerColor.Red,
    clergy: ['LB2R'] as Clergy[],
    settlements: [],
    landscape: [
      [[], [], [], [], [], [], [], ['H'], ['M', 'G28', 'PRIR']],
      [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], ['H', 'F27'], ['.']],
      [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3', 'LB1R'], [], []],
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
      [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'G19', 'PRIG'], ['H'], ['H'], [], []],
      [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LG1'], [], []],
      [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LG2'], ['P'], ['P', 'LG3'], [], []],
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

  describe('use', () => {
    it('retains undefined state', () => {
      const s1 = festivalGround()(undefined)!
      expect(s1).toBeUndefined()
    })

    it('allows noop for no param input', () => {
      const s1 = festivalGround()(s0)!
      expect(s1).toBe(s0)
    })

    it('allows noop with empty strings', () => {
      const s1 = festivalGround('', '')(s0)!
      expect(s1).toBe(s0)
    })

    it('given a beer, returns 2 points in a book', () => {
      const s1 = festivalGround('Be', 'Bo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
      })
    })

    it('given a beer, returns 5 points in a book+ceramic', () => {
      const s1 = festivalGround('Be', 'CeBo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ceramic: 1,
      })
    })

    it('given a beer, will not return 6 points in 2 ceramics', () => {
      const s1 = festivalGround('Be', 'CeCe')(s0)!
      expect(s1).toBeUndefined()
    })

    it('given a beer, will not return 8 points in a reliquary', () => {
      const s1 = festivalGround('Be', 'Rq')(s0)!
      expect(s1).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('offers beer if the player has one', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            beer: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([], s1)
      expect(c0).toStrictEqual(['Be', ''])
    })
    it('only offers noop if no beer', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            beer: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([], s1)
      expect(c0).toStrictEqual([''])
    })
    it('if given a beer, offers ways of making points', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscapeOffset: 1,
            landscape: [
              [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['H', 'LFO'], ['H'], [], []],
              [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'G41'], ['H', 'LB1'], [], []],
              [['W'], ['C'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G01'], ['P', 'LB3', 'LB2B'], [], []],
              [['W'], ['C', 'G26', 'LB1B'], [], [], [], [], []],
            ] as Tile[][],
            beer: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete(['Be'], s1)
      expect(c0).toStrictEqual([
        // different ways of giving at most 9 points, ordered by most points first
        'CeCeCe',
        'OrCeBo',
        'CeBoBoBo',
        'Rq',
        'OrOr',
        'OrBoBo',
        'CeCeBo',
        'BoBoBoBo',
        'OrCe',
        'CeBoBo',
        'CeCe',
        'OrBo',
        'BoBoBo',
        'CeBo',
        'Or',
        'BoBo',
        'Ce',
        'Bo',
        '',
      ])
    })

    it('only allows completion if given input and output', () => {
      const c0 = complete(['Be', 'BoCe'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('returns [] on more than two params', () => {
      const c0 = complete(['Be', 'Bo', 'Ce'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
