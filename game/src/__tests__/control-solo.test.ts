import { GameStatePlaying, control, reducer } from '..'
import { spiel } from '../spiel'

describe('control/settlement round checks', () => {
  const s0 = spiel`
CONFIG 1 france long
START R B
CUT_PEAT 0 0
COMMIT
FELL_TREES 1 0
COMMIT
USE LR1
COMMIT
BUILD G07 0 0
USE G07 PtPt
COMMIT
USE LR3
COMMIT
BUILD G01 3 1
COMMIT
USE LR2 Gn
CONVERT GnGn
COMMIT
BUILD G06 1 0
USE G06 CoCoCo
COMMIT
BUY_DISTRICT 2 PLAINS
BUILD F09 3 2
COMMIT
USE LR1
COMMIT
FELL_TREES 0 2
COMMIT
CUT_PEAT 0 1
COMMIT
USE G07 PtPtPtPtPtPt
COMMIT
USE G06 CoCoCo
BUY_PLOT 2 COAST
COMMIT
BUY_DISTRICT 3 PLAINS
BUILD F03 1 3
USE F03 Pn
COMMIT
BUILD F04 -1 3
COMMIT
USE F04 GnGnGnGnGnGnGn
COMMIT
BUILD F05 0 2
USE F05 FlFlFlFlFlFlFlCoSwBrBr
COMMIT
BUILD G12 0 1
COMMIT
USE G12 BrBrBrPnCoCo
COMMIT
BUILD F08 2 2
USE F08 PnGnWoSw
BUY_PLOT 0 COAST
COMMIT
BUILD F11 -1 1
COMMIT` as GameStatePlaying

  it('gives options to build or buy land', () => {
    const c0 = control(s0, [])
    expect(c0.completion).toStrictEqual([
      //
      'BUILD',
      'BUY_PLOT',
      'BUY_DISTRICT',
      'CONVERT',
    ])
  })
  it('does not have option to buy if used', () => {
    const s1 = reducer(s0, ['BUY_PLOT', '0', 'MOUNTAIN']) as GameStatePlaying
    const c1 = control(s1, [])
    expect(c1.completion).toStrictEqual([
      //
      'BUILD',
      'CONVERT',
    ])
  })
  it('can build on neutral player', () => {
    expect(s0).toMatchObject({
      buildings: ['G02'],
    })
    expect(control(s0, [])?.completion).toStrictEqual([
      //
      'BUILD',
      'BUY_PLOT',
      'BUY_DISTRICT',
      'CONVERT',
    ])
    expect(control(s0, ['BUILD'])?.completion).toStrictEqual([
      //
      'G02',
    ])
    const s1 = reducer(s0, ['BUILD', 'G02', '3', '1']) as GameStatePlaying
    expect(s1).toBeDefined()
  })
})
