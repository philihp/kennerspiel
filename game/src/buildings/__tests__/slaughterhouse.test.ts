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
import { slaughterhouse } from '../slaughterhouse'

describe('buildings/slaughterhouse', () => {
  describe('slaughterhouse', () => {
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
      sheep: 10,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      hops: 0,
      coal: 0,
      book: 0,
      pottery: 0,
      whiskey: 0,
      straw: 5,
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
        id: 1,
        activePlayerIndex: 0,
        settling: false,
        extraRound: false,
        moveInRound: 1,
        round: 1,
        startingPlayer: 1,
        settlementRound: SettlementRound.S,
        nextUse: NextUseClergy.Any,
        canBuyLandscape: true,
        neutralBuildingPhase: false,
        mainActionUsed: false,
        bonusActions: [],
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
      const s1 = slaughterhouse('ShShShSwSwSw')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        sheep: 7,
        straw: 2,
        meat: 3,
      })
    })

    it('consumes everything if not enough straw', () => {
      const s1 = slaughterhouse('ShShShSwSw')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        sheep: 7,
        straw: 3,
        meat: 2,
      })
    })

    it('consumes everything if not enough sheep', () => {
      const s1 = slaughterhouse('ShShSwSwSw')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        sheep: 8,
        straw: 2,
        meat: 2,
      })
    })
  })
})
