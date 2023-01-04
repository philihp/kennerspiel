import { initialState, reducer } from '../reducer'
import { BuildingEnum, GameStatePlaying, GameStateSetup } from '../types'

describe('game 29767', () => {
  it('runs through moves', () => {
    const s0 = initialState
    const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
    expect(s1).toBeDefined()
    const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
    expect(s2).toBeDefined()
    expect(s2.status).toBe('PLAYING')
    expect(s2.round).toBe(1)
    expect(s2.moveInRound).toBe(1)
    expect(s2.settlementRound).toBe('S')
    expect(s2.extraRound).toBeFalsy()
    expect(s2.settling).toBeFalsy()
    expect(s2.buildings).not.toContain(BuildingEnum.BuildersMarket)
    expect(s2.players[0].peat).toBe(0)
    const s3 = reducer(s2, ['CUT_PEAT', '0', '0'])! as GameStatePlaying
    expect(s3).toBeDefined()
    expect(s3.players[0].peat).toBe(2)
    expect(s3.players[0].landscape[0][0]).toStrictEqual(['P'])
    expect(s3.rondel.peat).toBe(s3.rondel.pointingBefore)
    expect(s3.players[0].clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])
    const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
    expect(s4.round).toBe(1)
    expect(s4.moveInRound).toBe(2)
    expect(s4.players[0].grain).toBe(0)
    const s5 = reducer(s4, ['USE', 'LR2', 'Gn'])! as GameStatePlaying
    expect(s5.players[0].grain).toBe(2)
    // expect(s5.players[0].clergy).toStrictEqual(['LB2R', 'PRIR'])
  })
})
