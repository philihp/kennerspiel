import { initialState, reducer } from '../reducer'
import { GameStatePlaying, GameStateSetup } from '../types'

describe('game 29767', () => {
  it('runs through moves', () => {
    const s0 = initialState
    const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
    expect(s1).toBeDefined()
    const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
    expect(s2).toBeDefined()
    expect(s2.status).toBe('PLAYING')
    expect(s2.settlementRound).toBe('S')
    expect(s2.extraRound).toBeFalsy()
    expect(s2.settling).toBeFalsy()
    const s3 = reducer(s2, ['CUT_PEAT', '0', '0'])! as GameStatePlaying
    expect(s3).toBeDefined()
    expect(s3.players[0].peat).toBe(3)
    expect(s3.players[0].landscape[0][0]).toStrictEqual(['P'])
    expect(s3.rondel.peat).toBe(s3.rondel.pointingBefore)
    const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
  })
})
