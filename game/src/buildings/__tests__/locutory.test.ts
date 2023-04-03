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
import { locutory } from '../locutory'

describe('buildings/locutory', () => {
  describe('locutory', () => {
    const p0 = {
      color: PlayerColor.White,
      clergy: ['LB2W'] as Clergy[],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LW1', 'PRIW'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LW2'], ['P'], ['P', 'LW3', 'LB1W'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 0,
      penny: 5,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      peat: 0,
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
    } as Tableau
    const s0: GameStatePlaying = {
      ...initialState,
      randGen: undefined,
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
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('sanity', () => {
      expect(true).toBeTruthy()
    })

    it('allows a noop with empty string', () => {
      const s1 = locutory('')(s0)!
      expect(s1).toBe(s0)
    })
    it('allows a noop with nothing', () => {
      const s1 = locutory()(s0)!
      expect(s1).toBe(s0)
    })
    it('retains undefined state', () => {
      const s1 = locutory()(undefined)
      expect(s1).toBeUndefined()
    })

    it('consumes two pennies', () => {
      const s1 = locutory('PnPn')(s0)!
      expect(s1.players[0].penny).toBe(3)
    })
    it('removes prior', () => {
      const s1 = locutory('PnPn')(s0)!
      expect(s1.players[0].landscape).toStrictEqual([
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LW1'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LW2'], ['P'], ['P', 'LW3', 'LB1W'], [], []],
      ])
    })
    it('returns prior', () => {
      const s1 = locutory('PnPn')(s0)!
      expect(s1.players[0].clergy).toStrictEqual(['LB2W', 'PRIW'])
    })
    it('allows for a building action', () => {
      const s1 = locutory('PnPn')(s0)!
      expect(s1.frame).toMatchObject({
        bonusActions: ['BUILD'],
      })
    })
  })
})
