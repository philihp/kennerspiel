import { control } from '../control'
import {
  Clergy,
  Controls,
  Frame,
  GameCommandConfigParams,
  GameStatePlaying,
  NextUseClergy,
  PlayerColor,
  Tableau,
  Tile,
} from '../types'

describe('control', () => {
  describe('control/view', () => {
    const c0 = {
      players: 3,
      length: 'long',
    } as GameCommandConfigParams
    const f0 = {
      activePlayerIndex: 0,
      bonusActions: [],
      next: 2,
      round: 0,
      startingPlayer: 0,
      settlementRound: 'S',
      currentPlayerIndex: 0,
      neutralBuildingPhase: false,
      bonusRoundPlacement: false,
      mainActionUsed: false,
      canBuyLandscape: true,
      unusableBuildings: [],
      usableBuildings: [],
      nextUse: NextUseClergy.Any,
    } as Frame
    const s0 = {
      config: c0,
      players: [
        {
          color: PlayerColor.Red,
          landscape: [
            [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'F03', 'LB1R'], ['H', 'LR1'], [], []],
            [[], [], ['P', 'LPE'], ['P'], ['P', 'LR2'], ['P', 'G01'], ['P', 'LR3', 'LB2R'], [], []],
          ] as Tile[][],
          landscapeOffset: 0,
          clergy: ['PRIR'] as Clergy[],
          settlements: [],
          wonders: 0,
          peat: 0,
          penny: 0,
          clay: 0,
          wood: 0,
          grain: 0,
          sheep: 0,
          stone: 0,
          flour: 0,
          grape: 0,
          nickel: 1,
          malt: 0,
          coal: 0,
          book: 0,
          ceramic: 0,
          whiskey: 0,
          straw: 0,
          meat: 0,
          ornament: 0,
          bread: 0,
          wine: 5,
          beer: 0,
          reliquary: 0,
        } as Tableau,
        {
          color: PlayerColor.Green,
        },
        {
          color: PlayerColor.Blue,
        },
      ],
      frame: f0,
      plotPurchasePrices: [7, 6, 5, 4, 3],
      districtPurchasePrices: [6, 5, 4, 3],
    } as GameStatePlaying

    it('returns a frame flower', () => {
      const c0 = control(s0, [], 0)
      expect(c0.flow.map((f) => f.player).slice(0, 10)).toStrictEqual([
        'R',
        'G',
        'B',
        'R',
        'G',
        'B',
        'R',
        'G',
        'B',
        'R',
      ])
    })

    it('gives a list of commands if no partial', () => {
      const c0 = control(s0, [], 0)
      expect(c0.partial).toStrictEqual([])
      expect(c0.completion).toStrictEqual(['USE', 'BUY_DISTRICT'])
    })

    it('gives a list of usable buidings if partial use', () => {
      const c0 = control(s0, ['USE'], 0)
      expect(c0.partial).toStrictEqual(['USE'])
      expect(c0.completion).toStrictEqual(['LR1', 'LR2', 'G01'])
    })

    it('using LR1 can be nothing, or Jo', () => {
      const c0 = control(s0, ['USE', 'LR1'], 0)
      expect(c0.partial).toStrictEqual(['USE', 'LR1'])
      expect(c0.completion).toStrictEqual(['', 'Jo'])
    })

    it('handles a mistake in the flow without an error or overflow', () => {
      const f1 = {
        ...f0,
        next: 1,
      } as Frame
      const c1 = {
        ...c0,
        players: 2,
        length: 'short',
      }
      const s1 = {
        ...s0,
        config: c1,
        frame: f1,
      } as GameStatePlaying
      expect(() => control(s1, [], 0)).not.toThrow()
      expect(control(s1, [], 0).flow?.length).toBeLessThan(100)
    })
  })
})
