import { GameStatePlaying, control, reducer } from '..'
import { spiel } from '../spiel'
import { NextUseClergy } from '../types'

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
  it('can navigate neutral building phase with expected completions', () => {
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
    expect(control(s0, ['BUILD', 'G02'])?.completion).toStrictEqual([
      //
      '3 1',
      '4 1',
    ])

    const s1 = reducer(s0, ['BUILD', 'G02', '3', '1']) as GameStatePlaying

    expect(control(s1, [])?.completion).toStrictEqual([
      //
      'WORK_CONTRACT',
      'BUY_PLOT',
      'BUY_DISTRICT',
      'CONVERT',
      'SETTLE',
      'COMMIT',
    ])

    // if they settle, then the WORK_CONTRACT goes away, because the neutral building phase is over
    const s2x = reducer(s1, ['SETTLE', 'SR2', '1', '2', 'BrCo']) as GameStatePlaying
    expect(control(s2x, [])?.completion).toStrictEqual([
      //
      'BUY_PLOT',
      'BUY_DISTRICT',
      'CONVERT',
      'COMMIT',
    ])

    // but they have an option for a work contract, which they can only do on the buildings just built
    // and are still visible
    expect(control(s1, ['WORK_CONTRACT'])?.completion).toStrictEqual(['G02'])

    const s3y = reducer(s1, ['WORK_CONTRACT', 'G02', 'Pn']) as GameStatePlaying

    // make sure it puts the PRIOR on it
    expect(s3y.players[1].landscape[1][5][2]).toBe('PRIB')
    expect(s3y.frame).toMatchObject({
      nextUse: NextUseClergy.Free,
      usableBuildings: ['G02'],
    })

    expect(control(s3y, [])?.completion).toStrictEqual([
      //
      'USE',
      'BUY_PLOT',
      'BUY_DISTRICT',
      'CONVERT',
      'SETTLE',
      'COMMIT',
    ])

    const s4 = reducer(s3y, ['USE', 'G02', 'PnGnBr', 'Pn']) as GameStatePlaying
    expect(s4.frame).toMatchObject({
      neutralBuildingPhase: false,
    })
    expect(s4.players[0].penny).toBe(6)

    expect(control(s4, [])?.completion).toStrictEqual([
      //
      'BUY_PLOT',
      'BUY_DISTRICT',
      'CONVERT',
      'SETTLE',
      'COMMIT',
    ])
  })
})
