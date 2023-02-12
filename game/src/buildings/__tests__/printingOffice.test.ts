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
import { printingOffice } from '../printingOffice'

describe('buildings/printingOffice', () => {
  describe('use', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = printingOffice()(s0)
      expect(s1).toBeUndefined()
    })

    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [['W'], ['C'], [], [], [], [], [], [], []],
        [['W'], ['C'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H'], [], []],
        [['W'], ['C'], [], [], [], [], [], [], []],
        [['W'], ['C'], ['P', 'LFO'], ['P'], ['P', 'LFO'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 3,
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
      const s1 = printingOffice()(s0)!
      expect(s1.players[0]).toMatchObject(s0.players[0])
    })

    it('can convert 1 forest', () => {
      const s1 = printingOffice('2', '-2')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H'], ['H'], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P', 'LFO'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        ] as Tile[][],
        wonders: 0,
        landscapeOffset: 3,
      })
    })

    it('can convert 2 forests', () => {
      const s1 = printingOffice('2', '0', '2', '-2')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H'], ['H'], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        ] as Tile[][],
        wonders: 0,
        landscapeOffset: 3,
      })
    })

    it('can convert 3 forests', () => {
      const s1 = printingOffice('2', '0', '1', '-2', '2', '-2')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 3,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P'], ['H'], ['H'], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        ] as Tile[][],
        wonders: 0,
        landscapeOffset: 3,
      })
    })
    it('can convert 4 forests', () => {
      const s1 = printingOffice('2', '0', '1', '-2', '2', '-2', '1', '1')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 4,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P'], ['H'], ['H'], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['P'], [], []],
        ] as Tile[][],
        wonders: 0,
        landscapeOffset: 3,
      })
    })
    it('ignores anything past the 4th forest', () => {
      const s1 = printingOffice('2', '0', '1', '-2', '2', '-2', '1', '1', '2', '1')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 4,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P'], ['H'], ['H'], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['P'], [], []],
        ] as Tile[][],
        wonders: 0,
        landscapeOffset: 3,
      })
    })
  })
})
