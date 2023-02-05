import { initialState, reducer } from '../../reducer'
import { GameStatePlaying } from '../../types'

describe('commands/withPrior', () => {
  describe('withPrior', () => {
    it('returns clergy after all are used', () => {
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
      const s12 = reducer(s11, ['COMMIT'])! as GameStatePlaying
      const s13 = reducer(s12, ['BUILD', 'G07', '3', '0'])! as GameStatePlaying
      const s14 = reducer(s13, ['USE', 'G07', 'PtPtPtPt'])! as GameStatePlaying
      const s15 = reducer(s14, ['COMMIT'])! as GameStatePlaying
      expect(s15.players[0].clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])
    })
    it('uses the prior if it was just built', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
      const s3 = reducer(s2, ['USE', 'LR1'])! as GameStatePlaying
      const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
      const s5 = reducer(s4, ['BUILD', 'G07', '3', '1'])! as GameStatePlaying
      const s6 = reducer(s5, ['USE', 'G07'])! as GameStatePlaying
      const s7 = reducer(s6, ['COMMIT'])! as GameStatePlaying
      expect(s7.players[0].landscape[1][5]).toStrictEqual(['P', 'G07', 'PRIR'])
    })
    it('uses the laybrother if it you want to commit first', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
      const s3 = reducer(s2, ['USE', 'LR1'])! as GameStatePlaying
      const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
      const s5 = reducer(s4, ['BUILD', 'G07', '3', '1'])! as GameStatePlaying
      const s6 = reducer(s5, ['COMMIT'])! as GameStatePlaying
      const s7 = reducer(s6, ['USE', 'G07'])! as GameStatePlaying
      const s8 = reducer(s7, ['COMMIT'])! as GameStatePlaying
      expect(s8.players[0].landscape[1][5]).toStrictEqual(['P', 'G07', 'LB2R'])
    })
    it('uses the prior, optionally', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
      const s3 = reducer(s2, ['USE', 'LR1'])! as GameStatePlaying
      const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
      const s5 = reducer(s4, ['BUILD', 'G07', '3', '1'])! as GameStatePlaying
      const s6 = reducer(s5, ['COMMIT'])! as GameStatePlaying
      const s7 = reducer(s6, ['WITH_PRIOR'])! as GameStatePlaying
      const s8 = reducer(s7, ['USE', 'G07'])! as GameStatePlaying
      const s9 = reducer(s8, ['COMMIT'])! as GameStatePlaying
      expect(s8.players[0].landscape[1][5]).toStrictEqual(['P', 'G07', 'PRIR'])
    })
    it('doesnt let you do it twice', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
      const s3 = reducer(s2, ['USE', 'LR1'])! as GameStatePlaying
      const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
      const s5 = reducer(s4, ['BUILD', 'G07', '3', '1'])! as GameStatePlaying
      const s6 = reducer(s5, ['USE', 'G07'])! as GameStatePlaying
      const s7 = reducer(s6, ['COMMIT'])! as GameStatePlaying
      const s8 = reducer(s7, ['WITH_PRIOR'])! as GameStatePlaying
      expect(s8).toBeUndefined()
    })
  })
})
