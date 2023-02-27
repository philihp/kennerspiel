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

import { sacristy } from '../sacristy'

describe('buildings/sacristy', () => {
  describe('use', () => {
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
      malt: 0,
      coal: 0,
      book: 2,
      ceramic: 2,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 2,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 2,
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
      wonders: 8,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('retains undefined state', () => {
      const s1 = sacristy()(undefined)
      expect(s1).toBeUndefined()
    })
    it('does nothing with empty input', () => {
      const s1 = sacristy('')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        ceramic: 2,
        ornament: 2,
        reliquary: 2,
        wonders: 0,
      })
    })
    it('does nothing with missing input', () => {
      const s1 = sacristy()(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        ceramic: 2,
        ornament: 2,
        reliquary: 2,
        wonders: 0,
      })
    })
    it('gives a wonder with one set of inputs', () => {
      const s1 = sacristy('BoPoOrRq')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ceramic: 1,
        ornament: 1,
        reliquary: 1,
        wonders: 1,
      })
      expect(s1.wonders).toBe(7)
    })
    it('swallows up extra but does not give more than one wonder', () => {
      const s1 = sacristy('BoCeOrRqBoCeOrRq')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 0,
        ceramic: 0,
        ornament: 0,
        reliquary: 0,
        wonders: 1,
      })
      expect(s1.wonders).toBe(7)
    })
    it('cant give out a wonder when no more exist', () => {
      const s1 = { ...s0, wonders: 0 }
      const s2 = sacristy('BoPoOrRq')(s1)!
      expect(s2).toBeUndefined()
    })
  })
})
