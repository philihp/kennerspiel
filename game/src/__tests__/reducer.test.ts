import { describe, it, expect, mock } from '../testHelpers'
import { identity } from 'ramda'
import { initialState } from '../state'
import * as actualCommands from '../commands'

// Create mocks before mock.module() so we can assert on them
const build = mock.fn(() => identity)
const commit = mock.fn(() => identity)
const config = mock.fn(() => identity)
const convert = mock.fn(() => identity)
const cutPeat = mock.fn(() => identity)
const fellTrees = mock.fn(() => identity)
const settle = mock.fn(() => identity)
const start = mock.fn(() => identity)
const use = mock.fn(() => identity)
const withPrior = mock.fn(() => identity)
const withLaybrother = mock.fn(() => identity)
const workContract = mock.fn(() => identity)
const buyPlot = mock.fn(() => identity)
const buyDistrict = mock.fn(() => identity)

await mock.module('../commands', {
  namedExports: {
    ...actualCommands,
    build,
    commit,
    config,
    convert,
    cutPeat,
    fellTrees,
    settle,
    start,
    use,
    withPrior,
    withLaybrother,
    workContract,
    buyPlot,
    buyDistrict,
  },
})

const { reducer } = await import('../reducer')

describe('reducer', () => {
  const s0 = {
    ...initialState,
  }

  it('handles unfound commands', () => {
    expect(() => reducer(s0, ['FOFOFOFOFOFO'])).toThrow()
  })

  describe('initialState', () => {
    it('exposes an initial state', () => {
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
