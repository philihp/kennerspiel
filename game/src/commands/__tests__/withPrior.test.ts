import { initialState, reducer } from '../../reducer'
import {
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { withPrior } from '../withPrior'

describe('commands/withPrior', () => {
  describe('withPrior', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: ['LB1B', 'LB2B', 'PRIB'] as Clergy[],
      settlements: [],
      landscape: [
        [['W'], ['C'], [], [], [], [], [], [], []],
        [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 1,
      peat: 0,
      penny: 1,
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
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 2,
        joker: 0,
        peat: 1,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
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
    }

    it('sets onlyprior on next use in frame', () => {
      const s1 = withPrior(s0)!
      expect(s1.frame.nextUse).toBe(NextUseClergy.OnlyPrior)
    })
    it('retains undefined state', () => {
      const s1 = withPrior(undefined)
      expect(s1).toBeUndefined()
    })
    it('wont do this if there is no prior', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: ['LB1B', 'LB2B'] as Clergy[],
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = withPrior(s1)
      expect(s2).toBeUndefined()
    })
  })
})
