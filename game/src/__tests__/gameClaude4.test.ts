import { describe, it, expect } from '../testHelpers'
import { reducer } from '../reducer'
import { initialState } from '../state'
import { GameState } from '../types'
import { control } from '../control'
import { map, reduce, split } from 'ramda'

describe('game Claude4', () => {
  it('runs through moves', () => {
    const s0 = initialState
    const openingMoves: string[][] = map(split(' '), [
      'CONFIG 2 france long',
      'START 43419 G W',
      'BUILD G07 3 0',
      'USE G07 Pt',
      'COMMIT',
      'FELL_TREES 2 0',
      'COMMIT',
      'USE LG3',
      'COMMIT',
      'BUY_DISTRICT 2 PLAINS',
      'FELL_TREES 0 2 Jo',
      'COMMIT',
      'USE LG1',
      'COMMIT',
      'USE LW2 Sh',
      'COMMIT',
      'BUILD G12 2 0',
    ])

    const s1 = reduce<string[], GameState>((state, move) => reducer(state, move)!, s0, openingMoves) as GameState
    const { flow, ...c2 } = control(s1, [])
    expect(s1.frame!.bonusActions).not.toContain('USE')
    expect(c2.completion).not.toContain('USE') // because it was already used!
  })
})
