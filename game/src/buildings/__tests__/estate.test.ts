import { initialState } from '../../reducer'
import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { estate } from '../estate'

describe('buildings/estate', () => {
  describe('estate', () => {
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
      coal: 10,
      book: 0,
      pottery: 3,
      whiskey: 0,
      straw: 0,
      meat: 10,
      ornament: 0,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 0,
    }
    const s0: GameStatePlaying = {
      ...initialState,
      status: GameStatusEnum.PLAYING,
      activePlayerIndex: 0,
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
      settling: false,
      extraRound: false,
      moveInRound: 1,
      round: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
      buildings: [],
      nextUse: NextUseClergy.Any,
      canBuyLandscape: true,
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
      neutralBuildingPhase: false,
    }

    it('retains undefined state', () => {
      const s1 = estate('')(undefined)!
      expect(s1).toBeUndefined()
    })

    it('allows noop', () => {
      const s1 = estate()(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 0,
        ornament: 0,
        meat: 10,
        coal: 10,
      })
    })

    it('can convert 10 food', () => {
      const s1 = estate('MtMt')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ornament: 1,
        meat: 8,
        coal: 10,
      })
    })
    it('can convert 15 food and just loses the extra', () => {
      const s1 = estate('MtMtMt')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ornament: 1,
        meat: 7,
        coal: 10,
      })
    })
    it('can convert 20 food', () => {
      const s1 = estate('MtMtMtMt')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        ornament: 2,
        meat: 6,
        coal: 10,
      })
    })

    it('can convert 10 food and 6 energy', () => {
      const s1 = estate('MtMtCoCo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        ornament: 2,
        meat: 8,
        coal: 8,
      })
    })

    it('can convert 6 energy', () => {
      const s1 = estate('CoCo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ornament: 1,
        meat: 10,
        coal: 8,
      })
    })
    it('can convert 12 energy', () => {
      const s1 = estate('CoCoCoCo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        ornament: 2,
        meat: 10,
        coal: 6,
      })
    })
  })
})
