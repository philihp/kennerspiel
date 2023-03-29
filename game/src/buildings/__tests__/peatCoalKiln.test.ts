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
import { peatCoalKiln } from '..'

describe('buildings/peatCoalKiln', () => {
  describe('peatCoalKiln', () => {
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
      const s3 = peatCoalKiln('PtPtPt')(undefined)
      expect(s3).toBeUndefined()
    })
    it('goes through a happy path', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            coal: 0,
            penny: 0,
            peat: 5,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = peatCoalKiln('PtPt')(s1)!
      expect(s2.players[0]).toMatchObject({
        peat: 3,
        coal: 3,
        penny: 1,
      })
    })
    it('can take no params', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            coal: 0,
            penny: 0,
            peat: 5,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = peatCoalKiln()(s1)!
      expect(s2.players[0]).toMatchObject({
        peat: 5,
        coal: 1,
        penny: 1,
      })
    })
  })
})
