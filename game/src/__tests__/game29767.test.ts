import { initialState, reducer } from '../reducer'

describe('game 29767', () => {
  it('runs through moves', () => {
    const s0 = initialState
    const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
    const s2 = reducer(s1, ['START', '42', 'R'])!
    const s3 = reducer(s2, ['CUT_PEAT', '0', '0'])!
    expect(s3).toBeDefined()
  })
})
