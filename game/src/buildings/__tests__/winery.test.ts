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
import { winery } from '../winery'

describe('buildings/winery', () => {
  describe('winery', () => {
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
      penny: 10,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 10,
      stone: 0,
      flour: 0,
      grape: 10,
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

    it('goes through a happy path', () => {
      const s1 = winery('GpGpGp', 'Wn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        grape: 7,
        wine: 12,
        nickel: 1,
        penny: 12,
      })
    })

    it('convert to wine then immediately to grape', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], grape: 1, wine: 0, penny: 0, nickel: 0 }, ...s0.players.slice(1)],
      }

      const s2 = winery('Gp', 'Wn')(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        grape: 0,
        wine: 0,
        penny: 2,
        nickel: 1,
      })
    })

    it('can skip grape part', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], grape: 0, wine: 1, penny: 0, nickel: 0 }, ...s0.players.slice(1)],
      }
      const s2 = winery('', 'Wn')(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        wine: 0,
        penny: 2,
        nickel: 1,
      })
    })
  })
})
