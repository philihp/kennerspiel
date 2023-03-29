import { newRandGen } from 'fn-pcg'
import { times } from 'ramda'
import { initialState } from '../../../state'
import {
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../../types'
import { addNeutralPlayer } from '../addNeutralPlayer'

describe('board/frame/addNeutralPlayer', () => {
  describe('addNeutralPlayer', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: ['LB1B', 'LB2B', 'PRIB'] as Clergy[],
      settlements: [],
      landscape: [
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 0,
      peat: 0,
      penny: 100,
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
      randGen: newRandGen(42),
      status: GameStatusEnum.PLAYING,
      config: {
        country: 'france',
        players: 1,
        length: 'long',
      },
      rondel: {
        pointingBefore: 0,
      },
      wonders: 0,
      players: [p0],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
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
    }

    it('creates appropriate landscapes', () => {
      const s1 = addNeutralPlayer(s0)!
      expect(s1.players[0].landscape).toStrictEqual([
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ])
      expect(s1.players[1].landscape).toStrictEqual([
        [[], [], ['P', 'G13'], ['P'], ['P'], ['P'], ['H', 'LR1'], [], []],
        [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
      ])
    })

    it('creates appropriate clergy', () => {
      const s1 = addNeutralPlayer(s0)!
      expect(s1.players[0].clergy).toStrictEqual(['LB1B', 'LB2B', 'PRIB'])
      expect(s1.players[1].clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])
    })

    it('does not give the neutral player the same color as the starting player', () => {
      const colors = [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green, PlayerColor.White]
      times((seed) => {
        colors.forEach((color) => {
          const s1 = {
            ...s0,
            randGen: newRandGen(seed),
            players: [{ ...s0.players[0], color }],
          }
          const s2 = addNeutralPlayer(s1)!
          expect(s2.players[0].color).not.toBe(s2.players[1].color)
        })
      }, 50)
    })
  })
})
