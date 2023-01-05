import { initialState, reducer } from '../reducer'
import { BuildingEnum, GameStatePlaying, GameStateSetup } from '../types'

describe('game 29767', () => {
  it('runs through moves', () => {
    const s0 = initialState
    const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
    const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
    const s3 = reducer(s2, ['CUT_PEAT', '0', '0'])! as GameStatePlaying
    const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
    const s5 = reducer(s4, ['USE', 'LR2', 'Gn'])! as GameStatePlaying
    const s6 = reducer(s5, ['COMMIT'])! as GameStatePlaying
    const s7 = reducer(s6, ['FELL_TREES', '1', '1'])! as GameStatePlaying
    const s8 = reducer(s7, ['COMMIT'])! as GameStatePlaying
    const s9 = reducer(s8, ['CUT_PEAT', '0', '1']!) as GameStatePlaying
    const s10 = reducer(s9, ['COMMIT'])! as GameStatePlaying
    const s11 = reducer(s10, ['USE', 'LR1'])! as GameStatePlaying
    expect(s2.status).toBe('PLAYING')
    expect(s2.round).toBe(1)
    expect(s2.moveInRound).toBe(1)
    expect(s2.settlementRound).toBe('S')
    expect(s2.extraRound).toBeFalsy()
    expect(s2.settling).toBeFalsy()
    expect(s2.buildings).not.toContain(BuildingEnum.BuildersMarket)
    expect(s2.players[0].peat).toBe(0)
    expect(s3).toBeDefined()
    expect(s3.players[0].peat).toBe(2)
    expect(s3.players[0].landscape[0][0]).toStrictEqual(['P'])
    expect(s3.rondel.peat).toBe(s3.rondel.pointingBefore)
    expect(s3.players[0].clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])
    expect(s4.round).toBe(1)
    expect(s4.moveInRound).toBe(2)
    expect(s4.players[0].grain).toBe(0)
    expect(s5.players[0].grain).toBe(2)
    expect(s5.players[0].clergy).toStrictEqual(['LB2R', 'PRIR'])
    expect(s6.round).toBe(2)
    expect(s6.moveInRound).toBe(1)
    expect(s6.rondel.pointingBefore).toBe(2)

    expect(s6.players[0].wood).toBe(0)
    expect(s6.rondel.wood).toBe(0)
    expect(s7.rondel.wood).toBe(2)
    expect(s7.players[0].wood).toBe(3)

    expect(s8.round).toBe(2)
    expect(s8.moveInRound).toBe(2)
    expect(s8.rondel.pointingBefore).toBe(2)

    expect(s8.players[0].peat).toBe(2)
    expect(s9.players[0].peat).toBe(4)
    expect(s9.rondel.peat).toBe(2)

    expect(s10.round).toBe(3)
    expect(s10.moveInRound).toBe(1)
    expect(s10.rondel.pointingBefore).toBe(3)

    expect(s10.players[0].clay).toBe(0)
    expect(s10.rondel.clay).toBe(0)
    expect(s11.rondel.clay).toBe(3)
    expect(s11.players[0].clay).toBe(4)
  })
})
