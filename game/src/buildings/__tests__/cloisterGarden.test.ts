import { reducer } from '../../reducer'
import { initialState } from '../../state'
import {
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
  GameStatePlaying,
} from '../../types'
import { cloisterGarden } from '../cloisterGarden'

describe('buildings/cloisterGarden', () => {
  describe('cloisterGarden', () => {
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

    it('retains undefined state', () => {
      const s1 = cloisterGarden()(undefined)!
      expect(s1).toBeUndefined()
    })

    it('goes through a happy path', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P'], ['P'], ['P', 'F04'], ['P', 'F17', 'PRIR'], ['P', 'G01'], [], []],
              [[], [], ['P'], ['P'], ['P', 'G16'], ['P', 'F09'], ['P', 'LG1'], [], []],
              [[], [], ['P'], ['P'], ['P', 'LG2'], ['P', 'F08', 'LB1R'], ['P', 'LG3'], [], []],
            ] as Tile[][],
            landscapeOffset: 1,
            grape: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = cloisterGarden()(s1)!
      expect(s2.frame.usableBuildings).toHaveLength(2)
      expect(s2.frame.usableBuildings).not.toContain('F17')
      expect(s2.frame.usableBuildings).toContain('G16')
      expect(s2.frame.usableBuildings).toContain('LG1')
      expect(s2.frame.usableBuildings).not.toContain('F08')
      expect(s2.frame.nextUse).toBe('free')
      expect(s2.players[0]).toMatchObject({
        grape: 1,
      })
    })

    it('if used but not built, nothing can be used as a result', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            landscape: [
              [[], [], ['P'], ['P'], ['P', 'G16'], ['P'], ['P', 'LG1'], [], []],
              [[], [], ['P'], ['P'], ['P', 'LG2'], ['P', 'F08', 'LB1R'], ['P', 'LG3'], [], []],
            ] as Tile[][],
            landscapeOffset: 0,
            grape: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = cloisterGarden()(s1)!
      expect(s2).toBeDefined()
      expect(s2.frame).toMatchObject({
        usableBuildings: [],
      })
    })
  })
})
