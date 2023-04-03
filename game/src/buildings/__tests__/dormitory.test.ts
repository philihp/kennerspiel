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
import { dormitory } from '..'

describe('buildings/dormitory', () => {
  describe('dormitory', () => {
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
      wood: 3,
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
      straw: 3,
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
        pointingBefore: 0,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = dormitory()(s0)
      expect(s1).toBeUndefined()
    })
    it('accepts null input', () => {
      const s1 = dormitory()(s0)!
      expect(s1.players[0]).toMatchObject({
        ceramic: 1,
        book: 0,
      })
    })
    it('accepts empty input', () => {
      const s1 = dormitory('')(s0)!
      expect(s1.players[0]).toMatchObject({
        ceramic: 1,
        book: 0,
      })
    })
    it('can make two books', () => {
      const s1 = dormitory('WoWoSwSw')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        wood: 1,
        straw: 1,
      })
    })
    it('will let you give it more wood than you need', () => {
      const s1 = dormitory('WoWoWoSw')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        wood: 0,
        straw: 2,
      })
    })
    it('will let you give it more straw than you need', () => {
      const s1 = dormitory('WoSwSwSw')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        wood: 2,
        straw: 0,
      })
    })
  })
})
