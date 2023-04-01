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
import { festivalGround } from '../festivalGround'

describe('buildings/festivalGround', () => {
  describe('3 players', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: ['PRIB'] as Clergy[],
      settlements: [],
      landscape: [
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'G41'], ['H', 'LB1'], [], []],
        [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G01'], ['P', 'LB3', 'LB2B'], [], []],
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
})
