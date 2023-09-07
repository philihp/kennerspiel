import { PCGState } from 'fn-pcg/dist/types'
import { assocPath } from 'ramda'
import { control } from '../control'
import {
  Clergy,
  Frame,
  GameCommandConfigParams,
  GameCommandEnum,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  Rondel,
  Tableau,
  Tile,
} from '../types'

import {
  completeBuild,
  completeCommit,
  completeConvert,
  completeCutPeat,
  completeFellTrees,
  completeSettle,
  completeUse,
  completeWorkContract,
  completeWithLaybrother,
  completeWithPrior,
  completeBuyPlot,
  completeBuyDistrict,
} from '../commands'

jest.mock('../commands', () => {
  const innerUse = jest.fn().mockReturnValue(['USE'])
  return {
    ...jest.requireActual('../commands'),
    completeBuild: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['BUILD'])),
    completeCommit: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['COMMIT'])),
    completeConvert: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['CONVERT'])),
    completeCutPeat: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['CUT_PEAT'])),
    completeFellTrees: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['FELL_TREES'])),
    completeSettle: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['SETTLE'])),
    completeUse: jest.fn().mockReturnValue(innerUse),
    completeWorkContract: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['WORK_CONTRACT'])),
    completeWithLaybrother: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['WITH_LAYBROTHER'])),
    completeWithPrior: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['WITH_PRIOR'])),
    completeBuyPlot: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['BUY_PLOT'])),
    completeBuyDistrict: jest.fn().mockReturnValue(jest.fn().mockReturnValue(['BUY_DISTRICT'])),
  }
})

describe('control', () => {
  describe('control/view', () => {
    const c0 = {
      country: 'france',
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
            [[], [], ['P', 'LMO'], ['P'], ['P', 'LR2'], ['P', 'G01'], ['P', 'LR3', 'LB2R'], [], []],
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
          clergy: [],
        },
        {
          color: PlayerColor.Blue,
          clergy: [],
        },
      ],
      frame: f0,
      plotPurchasePrices: [7, 6, 5, 4, 3],
      districtPurchasePrices: [6, 5, 4, 3],
      buildings: [],
      status: GameStatusEnum.PLAYING,
      rondel: {} as Rondel,
      wonders: 0,
      randGen: {} as PCGState,
    } as GameStatePlaying

    it('adds the points for wonders to score', () => {
      const p0 = control(s0, [], 0)
      expect(p0.score[0]).toMatchObject({ economic: 7, goods: 7, settlements: [], total: 14 })
      const s1 = assocPath(['players', 0, 'wonders'], 2, s0)
      const p1 = control(s1, [], 0)
      expect(p1.score[0]).toMatchObject({ economic: 7, goods: 67, settlements: [], total: 74 })
    })

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

      expect(c0.flow.map((f) => f.introduced)).toStrictEqual([
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ['F14', 'G16', 'F17', 'G18', 'G19'],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ['grape'],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ['F20', 'F21', 'G22', 'F24', 'G26'],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ['stone'],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ['F27', 'G28', 'F29', 'F30', 'F32', 'F33'],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ['G34', 'F35', 'F36', 'F37', 'F38', 'F40', 'G41'],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ])
    })

    it('asks the command completeBuild with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeBuild(undefined!)).toHaveBeenCalledWith([])
      expect(completeBuild).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeBuild', () => {
      control(s0, [GameCommandEnum.BUILD], 0)
      expect(completeBuild(undefined!)).toHaveBeenCalledWith([])
      expect(completeBuild).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeCommit with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeCommit(undefined!)).toHaveBeenCalledWith([])
      expect(completeCommit).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeCommit', () => {
      control(s0, [GameCommandEnum.COMMIT], 0)
      expect(completeCommit(undefined!)).toHaveBeenCalledWith([])
      expect(completeCommit).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeConvert with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeConvert(undefined!)).toHaveBeenCalledWith([])
      expect(completeConvert).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeConvert', () => {
      control(s0, [GameCommandEnum.CONVERT], 0)
      expect(completeConvert(undefined!)).toHaveBeenCalledWith([])
      expect(completeConvert).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeCutPeat with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeCutPeat(undefined!)).toHaveBeenCalledWith([])
      expect(completeCutPeat).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeCutPeat', () => {
      control(s0, [GameCommandEnum.CUT_PEAT], 0)
      expect(completeCutPeat(undefined!)).toHaveBeenCalledWith([])
      expect(completeCutPeat).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeFellTrees with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeFellTrees(undefined!)).toHaveBeenCalledWith([])
      expect(completeFellTrees).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeFellTrees', () => {
      control(s0, [GameCommandEnum.FELL_TREES], 0)
      expect(completeFellTrees(undefined!)).toHaveBeenCalledWith([])
      expect(completeFellTrees).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeSettle with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeSettle(undefined!)).toHaveBeenCalledWith([])
      expect(completeSettle).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeSettle', () => {
      control(s0, [GameCommandEnum.SETTLE], 0)
      expect(completeSettle(undefined!)).toHaveBeenCalledWith([])
      expect(completeSettle).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeUse with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeUse(undefined!)).toHaveBeenCalledWith([])
      expect(completeUse).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeUse', () => {
      control(s0, [GameCommandEnum.USE], 0)
      expect(completeUse(undefined!)).toHaveBeenCalledWith([])
      expect(completeUse).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeWorkContract with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeWorkContract(undefined!)).toHaveBeenCalledWith([])
      expect(completeWorkContract).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeWorkContract', () => {
      control(s0, [GameCommandEnum.WORK_CONTRACT], 0)
      expect(completeWorkContract(undefined!)).toHaveBeenCalledWith([])
      expect(completeWorkContract).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeWithLaybrother with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeWithLaybrother(undefined!)).toHaveBeenCalledWith([])
      expect(completeWithLaybrother).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeWithLaybrother', () => {
      control(s0, [GameCommandEnum.WITH_LAYBROTHER], 0)
      expect(completeWithLaybrother(undefined!)).toHaveBeenCalledWith([])
      expect(completeWithLaybrother).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeWithPrior with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeWithPrior(undefined!)).toHaveBeenCalledWith([])
      expect(completeWithPrior).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeWithPrior', () => {
      control(s0, [GameCommandEnum.WITH_PRIOR], 0)
      expect(completeWithPrior(undefined!)).toHaveBeenCalledWith([])
      expect(completeWithPrior).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeBuyPlot with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeBuyPlot(undefined!)).toHaveBeenCalledWith([])
      expect(completeBuyPlot).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeBuyPlot', () => {
      control(s0, [GameCommandEnum.BUY_PLOT], 0)
      expect(completeBuyPlot(undefined!)).toHaveBeenCalledWith([])
      expect(completeBuyPlot).toHaveBeenCalledWith(s0)
    })
    it('asks the command completeBuyDistrict with no partial to see if it can be used', () => {
      control(s0, [], 0)
      expect(completeBuyDistrict(undefined!)).toHaveBeenCalledWith([])
      expect(completeBuyDistrict).toHaveBeenCalledWith(s0)
    })
    it('delegates completion with other params to completeBuyDistrict', () => {
      control(s0, [GameCommandEnum.BUY_DISTRICT], 0)
      expect(completeBuyDistrict(undefined!)).toHaveBeenCalledWith([])
      expect(completeBuyDistrict).toHaveBeenCalledWith(s0)
    })
    it('concats root commands together into a list', () => {
      const c0 = control(s0, [], 0)
      expect(c0.completion).toStrictEqual([
        'USE',
        'BUILD',
        'CUT_PEAT',
        'FELL_TREES',
        'WORK_CONTRACT',
        'BUY_PLOT',
        'BUY_DISTRICT',
        'CONVERT',
        'SETTLE',
        'WITH_LAYBROTHER',
        'WITH_PRIOR',
        'COMMIT',
      ])
    })
    it('does not give any moves if game is over', () => {
      const s1 = {
        ...s0,
        status: GameStatusEnum.FINISHED,
      } as GameStatePlaying
      const c1 = control(s1, [], 0)
      expect(c1.completion).toStrictEqual([])
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
