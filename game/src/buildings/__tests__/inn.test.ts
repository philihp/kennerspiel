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
import { inn } from '../inn'

describe('buildings/inn', () => {
  describe('inn', () => {
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
      grain: 10,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      hops: 0,
      coal: 0,
      book: 0,
      pottery: 0,
      whiskey: 0,
      straw: 0,
      meat: 10,
      ornament: 0,
      bread: 0,
      wine: 10,
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
        pointingBefore: 0,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('goes through a happy path', () => {
      const s1 = inn('WnMtGnGnGn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        wine: 9,
        meat: 9,
        grain: 7,
        penny: 8,
        nickel: 1,
      })
    })

    it('has a max payout of 13, with 1 nickel and 8 pennies', () => {
      const s1 = inn('WnMtMtMtMtMtMt')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        wine: 9,
        meat: 4,
        grain: 10,
        penny: 8,
        nickel: 1,
      })
    })

    it('pays out 6 if only given wine', () => {
      const s1 = inn('Wn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        wine: 9,
        meat: 10,
        grain: 10,
        penny: 1,
        nickel: 1,
      })
    })

    it('pays out 7 if only given two wine', () => {
      const s1 = inn('WnWn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        wine: 8,
        meat: 10,
        grain: 10,
        penny: 2,
        nickel: 1,
      })
    })

    it('pays out 1 if given 1 food', () => {
      const s1 = inn('Gn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        wine: 10,
        meat: 10,
        grain: 9,
        penny: 1,
        nickel: 0,
      })
    })
  })
})
