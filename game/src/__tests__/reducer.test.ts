import { identity } from 'ramda'
import { reducer } from '../reducer'
import { initialState } from '../state'
import {
  build,
  commit,
  config,
  convert,
  cutPeat,
  fellTrees,
  settle,
  start,
  use,
  withLaybrother,
  withPrior,
  workContract,
  buyPlot,
  buyDistrict,
} from '../commands'

jest.mock('../commands', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...jest.requireActual('../commands'),
    build: jest.fn().mockReturnValue(identity),
    commit: jest.fn().mockReturnValue(identity),
    config: jest.fn().mockReturnValue(identity),
    convert: jest.fn().mockReturnValue(identity),
    cutPeat: jest.fn().mockReturnValue(identity),
    fellTrees: jest.fn().mockReturnValue(identity),
    settle: jest.fn().mockReturnValue(identity),
    start: jest.fn().mockReturnValue(identity),
    use: jest.fn().mockReturnValue(identity),
    withPrior: jest.fn().mockReturnValue(identity),
    withLaybrother: jest.fn().mockReturnValue(identity),
    workContract: jest.fn().mockReturnValue(identity),
    buyPlot: jest.fn().mockReturnValue(identity),
    buyDistrict: jest.fn().mockReturnValue(identity),
  }
})

describe('reducer', () => {
  const s0 = {
    ...initialState,
  }

  it('handles unfound commands', () => {
    expect(() => reducer(s0, ['FOFOFOFOFOFO'])).toThrow()
  })

  describe('initialState', () => {
    it('exposes an initial state', () => {
      expect.assertions(1)
      expect(initialState).toBeDefined()
    })
  })

  describe('config', () => {
    it('calls config', () => {
      reducer(s0, ['CONFIG', '3', 'france', 'long'])!
      expect(config).toHaveBeenCalled()
    })
  })

  describe('start', () => {
    it('calls start', () => {
      reducer(s0, ['START', '42', 'R', 'G', 'B'])!
      expect(start).toHaveBeenCalled()
    })
  })

  describe('cutPeat', () => {
    it('calls cutPeat', () => {
      reducer(s0, ['CUT_PEAT', '0', '0', 'Jo'])!
      expect(cutPeat).toHaveBeenCalled()
    })
  })

  describe('fellTrees', () => {
    it('calls fellTrees', () => {
      reducer(s0, ['FELL_TREES', '1', '0', 'Jo'])!
      expect(fellTrees).toHaveBeenCalled()
    })
  })

  describe('build', () => {
    it('calls build', () => {
      reducer(s0, ['BUILD', 'G01', '3', '0'])!
      expect(build).toHaveBeenCalled()
    })
  })

  describe('withLaybrother', () => {
    it('calls withLaybrother', () => {
      reducer(s0, ['WITH_LAYBROTHER'])!
      expect(withLaybrother).toHaveBeenCalled()
    })
  })

  describe('withPrior', () => {
    it('calls withPrior', () => {
      reducer(s0, ['WITH_PRIOR'])!
      expect(withPrior).toHaveBeenCalled()
    })
  })

  describe('workContract', () => {
    it('calls workContract', () => {
      reducer(s0, ['WORK_CONTRACT', 'G01', 'Wn'])!
      expect(workContract).toHaveBeenCalled()
    })
  })

  describe('use', () => {
    it('calls use', () => {
      reducer(s0, ['USE', 'LR1', 'Jo'])!
      expect(use).toHaveBeenCalled()
    })
  })

  describe('convert', () => {
    it('calls convert', () => {
      reducer(s0, ['CONVERT', 'Gn'])!
      expect(convert).toHaveBeenCalled()
    })
  })

  describe('settle', () => {
    it('calls settle', () => {
      reducer(s0, ['SETTLE', 'SB1', '0', '0', 'MtCoCo'])!
      expect(settle).toHaveBeenCalled()
    })
  })

  describe('commit', () => {
    it('calls commit', () => {
      reducer(s0, ['COMMIT'])!
      expect(commit).toHaveBeenCalled()
    })
  })

  describe('buyDistrict', () => {
    it('calls buyDistrict', () => {
      reducer(s0, ['BUY_DISTRICT', '-1', 'HILLS'])!
      expect(buyDistrict).toHaveBeenCalled()
    })
  })

  describe('buyPlot', () => {
    it('calls buyPlot', () => {
      reducer(s0, ['BUY_PLOT', '1', 'COAST'])!
      expect(buyPlot).toHaveBeenCalled()
    })
  })
})
