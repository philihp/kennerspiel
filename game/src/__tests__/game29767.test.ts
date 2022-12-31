import { initialState, reducer } from '../reducer'

describe('game 29767', () => {
  it('runs through moves', () => {
    const s0 = initialState
    const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
    const s2 = reducer(s1, ['START', '42', 'R'])
    expect(s2).toBeDefined()
  })
})
