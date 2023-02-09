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
import { fuelMerchant } from '../fuelMerchant'

describe('buildings/fuelMerchant', () => {
  describe('fuelMerchant', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
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
      frame: {
        id: 1,
        startingPlayer: 1,
        settlementRound: SettlementRound.S,
        workContractCost: 1,
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
      const s1 = fuelMerchant()(s0)
      expect(s1).toBeUndefined()
    })
    it('burns 4 energy', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 5,
            wood: 2,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = fuelMerchant('PtPt')(s1)!
      expect(s2.players[0]).toMatchObject({
        peat: 3,
        wood: 2,
        penny: 0,
        nickel: 1,
      })
    })
    it('will not automatically upchange to nickels', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 5,
            wood: 2,
            penny: 3,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = fuelMerchant('PtPtPt')(s1)!
      expect(s2.players[0]).toMatchObject({
        peat: 2,
        wood: 2,
        penny: 6,
        nickel: 1,
      })
    })
    it('burns 9 energy', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 5,
            wood: 2,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = fuelMerchant('PtPtPtWoPt')(s1)!
      expect(s2.players[0]).toMatchObject({
        peat: 1,
        wood: 1,
        penny: 0,
        nickel: 2,
      })
    })
  })
})
