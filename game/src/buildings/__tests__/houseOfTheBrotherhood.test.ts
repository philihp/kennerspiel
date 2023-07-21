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
import { houseOfTheBrotherhood, complete } from '../houseOfTheBrotherhood'

describe('buildings/houseOfTheBrotherhood', () => {
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
    wine: 1,
    beer: 0,
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
      const s1 = houseOfTheBrotherhood()(undefined)!
      expect(s1).toBeUndefined()
    })

    it('searches landscape for all cloisters', () => {
      const s1 = houseOfTheBrotherhood('Ni', 'BoBoBo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 3,
      })
    })

    it('can request 5 when entitled to 6', () => {
      const s1 = houseOfTheBrotherhood('Ni', 'BoCe')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ceramic: 1,
      })
    })

    it('can request 6 when entitled to 6', () => {
      const s1 = houseOfTheBrotherhood('Ni', 'CeCe')(s0)!
      expect(s1.players[0]).toMatchObject({
        ceramic: 2,
      })
    })

    it('does not allow requesting too much', () => {
      const s1 = houseOfTheBrotherhood('Ni', 'OrOr')(s0)!
      expect(s1).toBeUndefined()
    })
  })

  describe('2 players, long', () => {
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
      wine: 1,
      beer: 0,
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
        players: 2,
        length: 'long',
      },
      rondel: {
        pointingBefore: 3,
        grape: 1,
        joker: 2,
      },
      wonders: 0,
      players: [p0, p1],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('3 cloisters gets 4.5 points, so you can get 2 books', () => {
      const s1 = houseOfTheBrotherhood('Ni', 'BoBo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
      })
    })
    it('3 cloisters gets 4.5 points, so you cant get a book and a ceramic', () => {
      const s1 = houseOfTheBrotherhood('Ni', 'BoCe')(s0)!
      expect(s1).toBeUndefined()
    })
  })

  describe('1 player', () => {
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
      wine: 1,
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
        players: 1,
        length: 'short',
      },
      rondel: {
        pointingBefore: 3,
        grape: 1,
        joker: 2,
      },
      wonders: 0,
      players: [p0],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('gets 1 point per cloister, so 2 can be requested', () => {
      const s1 = houseOfTheBrotherhood('Ni', 'Bo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ceramic: 0,
        nickel: 0,
      })
    })

    it('gets 1 point per cloister, so 3 can be requested', () => {
      const s1 = houseOfTheBrotherhood('Ni', 'Ce')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 0,
        ceramic: 1,
      })
    })

    it('gets 1 point per cloister, so no more than 3 can be requested', () => {
      const s1 = houseOfTheBrotherhood('Ni', 'Or')(s0)!
      expect(s1).toBeUndefined()
    })

    it('allows a noop', () => {
      const s1 = houseOfTheBrotherhood('', '')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 0,
        ceramic: 0,
      })
    })

    it('will take free money', () => {
      const s1 = houseOfTheBrotherhood('Ni', '')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 0,
        ceramic: 0,
        nickel: 0,
        penny: 0,
      })
    })
  })

  describe('complete', () => {
    it('offers 5 coins if the player has it', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 1,
            penny: 3,
            whiskey: 2,
            wine: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([], s1)
      expect(c0).toStrictEqual(['Ni', 'PnWhWh', 'PnPnWhWh', 'PnPnPnWh', ''])
    })
    it('only offers noop if no money', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
            penny: 0,
            whiskey: 0,
            wine: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([], s1)
      expect(c0).toStrictEqual([''])
    })
    it('with 5 coins, offers ways of making points', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete(['Ni'], s1)
      expect(c0).toStrictEqual(['CeCe', 'BoBoBo', 'CeBo', 'Or', 'BoBo', 'Ce', 'Bo', ''])
    })
    it('with 5 coins, offers ways of making points in long 2p game', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 1,
          },
          s0.players.slice(1),
        ],
        config: {
          ...s0.config,
          players: 2,
          length: 'long',
        },
      } as GameStatePlaying
      const c0 = complete(['Ni'], s1)
      expect(c0).toStrictEqual(['Or', 'BoBo', 'Ce', 'Bo', ''])
    })
    it('shows nothing else', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete(['Ni', 'CeCe'])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('returns [] on more than two params', () => {
      const c0 = complete(['Be', 'Bo', 'Ce'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
