import { reducer } from '../reducer'
import { initialState } from '../state'
import { GameStatePlaying } from '../types'

describe('game 29767', () => {
  it('runs through moves', () => {
    const s0 = initialState
    const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!

    const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
    expect(s2.status).toBe('PLAYING')
    expect(s2.frame).toMatchObject({
      settlementRound: 'S',
    })
    expect(s2.players[0].peat).toBe(0)
    expect(s2.rondel).toMatchObject({
      pointingBefore: 1,
    })

    const s3 = reducer(s2, ['CUT_PEAT', '0', '0'])! as GameStatePlaying
    expect(s3.players[0].peat).toBe(2)
    expect(s3.players[0].landscape[0][2]).toStrictEqual(['P'])
    expect(s3.rondel.peat).toBe(s3.rondel.pointingBefore)
    expect(s3.players[0].clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])

    const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
    expect(s4.players[0].grain).toBe(0)

    const s5 = reducer(s4, ['USE', 'LR2', 'Gn'])! as GameStatePlaying
    expect(s5.players[0].grain).toBe(2)
    expect(s5.players[0].clergy).toStrictEqual(['LB2R', 'PRIR'])

    const s6 = reducer(s5, ['COMMIT'])! as GameStatePlaying
    expect(s6.rondel.pointingBefore).toBe(2)

    expect(s6.players[0].wood).toBe(0)
    expect(s6.rondel.wood).toBe(0)

    const s7 = reducer(s6, ['FELL_TREES', '1', '1'])! as GameStatePlaying
    expect(s7.rondel.wood).toBe(2)
    expect(s7.players[0].wood).toBe(3)

    const s8 = reducer(s7, ['COMMIT'])! as GameStatePlaying
    expect(s8.rondel.pointingBefore).toBe(2)
    expect(s8.players[0].peat).toBe(2)

    const s9 = reducer(s8, ['CUT_PEAT', '0', '1']) as GameStatePlaying
    expect(s9.players[0].peat).toBe(4)
    expect(s9.rondel.peat).toBe(2)

    const s10 = reducer(s9, ['COMMIT'])! as GameStatePlaying
    expect(s10.rondel.pointingBefore).toBe(3)
    expect(s10.players[0].clay).toBe(0)
    expect(s10.rondel.clay).toBe(0)

    const s11 = reducer(s10, ['USE', 'LR1'])! as GameStatePlaying
    expect(s11.rondel.clay).toBe(3)
    expect(s11.players[0].clay).toBe(4)

    const s12 = reducer(s11, ['COMMIT'])! as GameStatePlaying
    expect(s12.rondel.pointingBefore).toBe(3)
    expect(s12.players[0].clay).toBe(4)
    expect(s12.players[0].landscape).toStrictEqual([
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1', 'LB2R'], [], []],
      [[], [], ['P'], ['P'], ['P', 'LR2', 'LB1R'], ['P'], ['P', 'LR3'], [], []],
    ])

    const s13 = reducer(s12, ['BUILD', 'G07', '3', '0'])! as GameStatePlaying
    expect(s13.players[0].landscape).toStrictEqual([
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'G07'], ['H', 'LR1', 'LB2R'], [], []],
      [[], [], ['P'], ['P'], ['P', 'LR2', 'LB1R'], ['P'], ['P', 'LR3'], [], []],
    ])
    expect(s13.players[0].clay).toBe(3)
    expect(s13.buildings).not.toContain('G07')
    expect(s13.players[0]).toMatchObject({
      peat: 4,
      penny: 0,
      coal: 0,
    })

    const s14 = reducer(s13, ['USE', 'G07', 'PtPtPtPt'])! as GameStatePlaying
    expect(s14.players[0]).toMatchObject({
      penny: 1,
      peat: 0,
      coal: 5,
      clergy: [],
    })
    expect(s14.rondel.pointingBefore).toBe(3)

    const s15 = reducer(s14, ['COMMIT'])! as GameStatePlaying
    expect(s15.rondel.pointingBefore).toBe(4)
    expect(s15.players[0]).toMatchObject({
      grain: 2,
      straw: 0,
      clergy: ['LB1R', 'LB2R', 'PRIR'],
    })

    const s16 = reducer(s15, ['CONVERT', 'Gn'])! as GameStatePlaying
    expect(s16.players[0]).toMatchObject({
      grain: 1,
      straw: 1,
    })

    const s17 = reducer(s16, ['BUILD', 'G06', '0', '0'])! as GameStatePlaying
    expect(s17.players[0].landscape).toStrictEqual([
      [[], [], ['P', 'G06'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'G07'], ['H', 'LR1'], [], []],
      [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
    ])
  })
})
