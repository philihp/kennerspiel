import { describe, it, expect } from '../testHelpers'
import { reducer } from '../reducer'
import { initialState } from '../state'
import { GameState } from '../types'
import { control } from '../control'
import { map, reduce, split } from 'ramda'

describe('game 1144d00b (issue #2138)', () => {
  it('lets the neutral player build a cloister building over a cloister building', () => {
    const moves: string[][] = map(split(' '), [
      'CONFIG 1 france long',
      'START 69979 W',
      'USE LW1',
      'COMMIT',
      'FELL_TREES 1 0',
      'COMMIT',
      'BUILD G07 1 0',
      'USE G07',
      'COMMIT',
      'USE LW2 Gn',
      'COMMIT',
      'CUT_PEAT 0 0',
      'COMMIT',
      'USE G07 PtPtPtPt',
      'COMMIT',
      'BUILD G06 3 0',
      'USE G06 CoCoCo',
      'BUY_PLOT 0 COAST',
      'COMMIT',
      'WORK_CONTRACT G13 Pn',
      'USE G13 PnPn',
      'COMMIT',
      'BUILD F11 -1 1',
      'COMMIT',
      'WORK_CONTRACT LR3 Pn',
      'USE LR3',
      'COMMIT',
      'BUILD F09 3 1',
      'COMMIT',
      'USE F09',
      'USE LW2 Sh',
      'COMMIT',
      'USE F09',
      'USE G06 CoCoCo',
      'BUY_DISTRICT 2 HILLS',
      'COMMIT',
      'BUY_PLOT 2 COAST',
      'CUT_PEAT 0 2 Jo',
      'COMMIT',
      'CUT_PEAT 0 1',
      'COMMIT',
      'BUILD F04 -1 2',
      'USE F04 GnGn',
      'COMMIT',
      'USE LW1',
      'COMMIT',
      'BUILD F05 0 1',
      'COMMIT',
      'USE G07 PtPtPtPtPtPtPtPtPtPtPtPtPt',
      'COMMIT',
      'USE F09',
      'USE G06 CoCoCo',
      'BUY_DISTRICT 3 HILLS',
      'COMMIT',
      'FELL_TREES 1 2',
      'COMMIT',
      'BUILD G01 4 2',
      'COMMIT',
      'BUILD G12 3 1',
      'BUILD F03 2 1',
      'BUILD F08 3 0',
      'BUILD G02 4 1',
    ])
    const s1 = reduce<string[], GameState>((state, move) => reducer(state, move)!, initialState, moves.slice(0, -1))
    expect(s1).toBeDefined()
    expect(s1.players![1].landscape[1][6][1]).toBe('LR3')
    expect(control(s1, ['BUILD', 'G02']).completion).toContain('4 1')

    const s2 = reducer(s1, moves[moves.length - 1])!
    expect(s2).toBeDefined()
    expect(s2.players![1].landscape[1][6]).toStrictEqual(['P', 'G02', 'LB2R'])
    expect(s2.buildings).toStrictEqual([])
    expect(control(s2, []).completion).toContain('SETTLE')
  })
})
