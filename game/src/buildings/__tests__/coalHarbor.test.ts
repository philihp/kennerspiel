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
import { coalHarbor } from '../coalHarbor'

describe('buildings/coalHarbor', () => {
  describe('coalHarbor', () => {
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
      peat: 10,
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
      const s1 = coalHarbor('PtPtPt')(s0)!
      expect(s1.players[0]).toMatchObject({
        peat: 7,
        whiskey: 3,
        nickel: 1,
        penny: 4,
      })
    })
    it('retains undefined state', () => {
      const s3 = coalHarbor('PtPtPt')(undefined)
      expect(s3).toBeUndefined()
    })
    it('noop with no input', () => {
      const s1 = coalHarbor()(s0)!
      expect(s1).toBe(s0)
    })
    it('noop with empty input', () => {
      const s1 = coalHarbor('')(s0)!
      expect(s1).toBe(s0)
    })
    it('can consume partially', () => {
      const s1 = coalHarbor('Pt')(s0)!
      expect(s1.players[0]).toMatchObject({
        peat: 9,
        whiskey: 1,
        nickel: 0,
        penny: 3,
      })
    })
  })
})
