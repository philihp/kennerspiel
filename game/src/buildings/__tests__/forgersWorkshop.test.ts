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
import { forgersWorkshop } from '../forgersWorkshop'

describe('buildings/forgersWorkshop', () => {
  describe('forgersWorkshop', () => {
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
      nickel: 10,
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
        pointingBefore: 3,
        grape: 1,
        joker: 2,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('can do a noop', () => {
      const s1 = forgersWorkshop()(undefined)!
      expect(s1).toBeUndefined()
    })

    it('can do a noop with no input', () => {
      const s1 = forgersWorkshop('')(undefined)!
      expect(s1).toBeUndefined()
    })

    it('can do both things', () => {
      const s1 = forgersWorkshop('NiNiNi')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        reliquary: 2,
        nickel: 7,
      })
    })

    it('can do just one', () => {
      const s1 = forgersWorkshop('Ni')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        reliquary: 1,
        nickel: 9,
      })
    })

    it('can do it 4 times', () => {
      const s1 = forgersWorkshop('NiNiNiNiNiNiNi')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        reliquary: 4,
        nickel: 3,
      })
    })
  })
})
