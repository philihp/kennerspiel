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
import { pilgrimageSite } from '../pilgrimageSite'

describe('buildings/pilgrimageSite', () => {
  describe('pilgrimageSite', () => {
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
      penny: 0,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      hops: 0,
      coal: 0,
      book: 10,
      pottery: 10,
      whiskey: 0,
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
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('retains undefined state', () => {
      const s1 = pilgrimageSite('')(undefined)!
      expect(s1).toBeUndefined()
    })

    it('allows noop', () => {
      const s1 = pilgrimageSite()(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 10,
        ornament: 10,
        pottery: 10,
        reliquary: 10,
      })
    })
    it('can do one conversion', () => {
      const s1 = pilgrimageSite('Bo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 9,
        ornament: 10,
        pottery: 11,
        reliquary: 10,
      })
    })
    it('can do two conversions', () => {
      const s1 = pilgrimageSite('Or', 'Or')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 10,
        ornament: 8,
        pottery: 10,
        reliquary: 12,
      })
    })
    it('can do two conversions on the same thing', () => {
      const s1 = pilgrimageSite('Bo', 'Po')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 9,
        ornament: 11,
        pottery: 10,
        reliquary: 10,
      })
    })
    it('two conversions on first param will just fail', () => {
      const s1 = pilgrimageSite('BoBoBo')(s0)!
      expect(s1).toBeUndefined()
    })
  })
})
