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
import { roundTower } from '../roundTower'

describe('buildings/roundTower', () => {
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
      penny: 10,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 10,
      malt: 0,
      coal: 0,
      book: 10,
      ceramic: 10,
      whiskey: 10,
      straw: 0,
      meat: 0,
      ornament: 10,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 10,
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
      wonders: 8,
      players: [p0],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('retains undefined state', () => {
      const s1 = roundTower()(undefined)
      expect(s1).toBeUndefined()
    })

    it('noop if empty inputs', () => {
      const s1 = roundTower('')(s0)
      expect(s1).toBe(s0)
    })

    it('noop if missing inputs', () => {
      const s1 = roundTower()(s0)
      expect(s1).toBe(s0)
    })

    it('follows happy path', () => {
      const s1 = roundTower('WhNiRqRqRqBo')(s0)!
      expect(s1.players[0]).toMatchObject({
        whiskey: 9,
        nickel: 9,
        penny: 10,
        reliquary: 7,
        book: 9,
        ceramic: 10,
        ornament: 10,
        wonders: 1,
      })
    })
  })
})
