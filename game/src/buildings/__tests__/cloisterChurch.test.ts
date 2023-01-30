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
import { cloisterChurch } from '../cloisterChurch'

describe('buildings/cloisterChurch', () => {
  describe('cloisterChurch', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      ] as Tile[][],
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
      book: 0,
      pottery: 0,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 0,
      bread: 3,
      wine: 4,
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

    it('works twice', () => {
      const s1 = cloisterChurch('BrBrWnWn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        bread: 1,
        wine: 2,
        reliquary: 2,
      })
    })

    it('works once', () => {
      const s1 = cloisterChurch('BrWn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        bread: 2,
        wine: 3,
        reliquary: 1,
      })
    })

    it('works once with extra just consumed', () => {
      const s1 = cloisterChurch('BrWnWn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        bread: 2,
        wine: 2,
        reliquary: 1,
      })
    })

    it('works with nothing, and gives nothing', () => {
      const s1 = cloisterChurch('')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        bread: 3,
        wine: 4,
        reliquary: 0,
      })
    })
  })
})
