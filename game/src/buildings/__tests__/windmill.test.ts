import { reducer, initialState } from '../../reducer'
import { BuildingEnum, GameStatePlaying } from '../../types'
import { windmill } from '../windmill'

describe('buildings/cloisterCourtyard', () => {
  describe('use', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = windmill()(s0)
      expect(s1).toBeUndefined()
    })
    it('goes through a happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '1', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
      const s3 = reducer(s2, ['USE', 'LR1', 'Cl'])! as GameStatePlaying
      expect(s3.players[0]).toMatchObject({
        clay: 2,
      })
      const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
      const s5 = reducer(s4, ['FELL_TREES', '1', '0', 'Jo'])! as GameStatePlaying
      expect(s5.players[0]).toMatchObject({
        wood: 2,
        clay: 2,
      })
      const s6 = reducer(s5, ['COMMIT'])! as GameStatePlaying
      const s7 = reducer(s6, ['FELL_TREES', '1', '1'])! as GameStatePlaying
      expect(s7.players[0]).toMatchObject({
        wood: 5,
        clay: 2,
      })
      const s8 = reducer(s7, ['COMMIT'])! as GameStatePlaying
      const s9 = reducer(s8, ['USE', 'LR2', 'Gn'])! as GameStatePlaying
      expect(s9.players[0]).toMatchObject({
        grain: 3,
      })
      const s10 = reducer(s9, ['COMMIT'])! as GameStatePlaying

      const s11 = reducer(s10, ['BUILD', 'F04', '3', '1'])! as GameStatePlaying
      expect(s11.players[0].landscape[1][5]).toStrictEqual(['P', 'F04'])
      expect(s11.players[0]).toMatchObject({
        clay: 0,
        wood: 2,
      })
      const s12 = reducer(s11, ['USE', 'F04', 'GnGn'])! as GameStatePlaying
      expect(s12.players[0]).toMatchObject({
        flour: 2,
        straw: 2,
        grain: 1,
      })
    })
  })
})
