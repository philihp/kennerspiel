import { initialState } from '../../reducer'
import {
  BuildingEnum,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { shippingCompany } from '../shippingCompany'

describe('buildings/shippingCompany', () => {
  describe('shippingCompany', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      ] as Tile[][],
      landscapeOffset: 0,
      peat: 10,
      penny: 0,
      clay: 0,
      wood: 10,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      hops: 0,
      coal: 10,
      book: 0,
      pottery: 0,
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
      activePlayerIndex: 0,
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 7,
        joker: 5,
      },
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      settling: false,
      extraRound: false,
      moveInRound: 1,
      round: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.C,
      buildings: [] as BuildingEnum[],
      nextUse: NextUseClergy.Any,
      canBuyLandscape: true,
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
      neutralBuildingPhase: false,
    }

    it('retains undefined state', () => {
      const s1 = shippingCompany()(undefined)!
      expect(s1).toBeUndefined()
    })
    it('burns wood and makes meat', () => {
      const s1 = shippingCompany('WoWoWo', 'Mt')(s0)!
      expect(s1.players[0]).toMatchObject({
        meat: 3,
        wood: 7,
      })
    })
    it('burns peat and makes bread', () => {
      const s1 = shippingCompany('PtPt', 'Br')(s0)!
      expect(s1.players[0]).toMatchObject({
        peat: 8,
        bread: 3,
      })
    })
    it('burns coal and makes wine', () => {
      const s1 = shippingCompany('Co', 'Wn')(s0)!
      expect(s1.players[0]).toMatchObject({
        coal: 9,
        wine: 3,
      })
    })
  })
})
