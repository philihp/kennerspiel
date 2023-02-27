import { initialState } from '../../state'
import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { calefactory } from '../calefactory'

describe('buildings/calefactory', () => {
  describe('calefactory', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 0,
      peat: 0,
      penny: 1,
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
      book: 10,
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

    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = calefactory()(s0)
      expect(s1).toBeUndefined()
    })

    it('adds a fell_trees to bonus actions', () => {
      const s1 = calefactory('Pn')(s0)!
      expect(s1.frame.bonusActions).toContain('CUT_PEAT')
      expect(s1.frame.bonusActions).toContain('FELL_TREES')
      expect(s1.players[0]).toMatchObject({
        wine: 1,
        penny: 0,
      })
    })

    it('allows paying for this with wine', () => {
      const s1 = calefactory('Wn')(s0)!
      expect(s1.frame.bonusActions).toContain('CUT_PEAT')
      expect(s1.frame.bonusActions).toContain('FELL_TREES')
      expect(s1.players[0]).toMatchObject({
        wine: 0,
        penny: 1,
      })
    })

    it('allows a noop with empty string', () => {
      const s1 = calefactory('')(s0)!
      expect(s1.frame.bonusActions).toHaveLength(0)
      expect(s1.players[0]).toMatchObject({
        wine: 1,
        penny: 1,
      })
    })
  })
})
