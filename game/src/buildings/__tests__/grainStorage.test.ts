import { reducer, initialState } from '../../reducer'
import { GameStatePlaying } from '../../types'
import { cloisterCourtyard } from '../cloisterCourtyard'

describe('buildings/cloisterCourtyard', () => {
  describe('cloisterCourtyard', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = cloisterCourtyard()(s0)
      expect(s1).toBeUndefined()
    })
    it('goes through a happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '1', 'france', 'short'])!
      const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
      const s3 = reducer(s2, ['FELL_TREES', '1', '0'])! as GameStatePlaying
      const s4 = reducer(s3, ['COMMIT'])! as GameStatePlaying
      // const s5 = reducer(s4, ['USE', 'LR3'])! as GameStatePlaying
      // const s6 = reducer(s5, ['COMMIT'])! as GameStatePlaying
      // expect(s6.players[0]).toMatchObject({
      //   penny: 2,
      //   grain: 0,
      //   straw: 0,
      // })
      s4.players[0].penny = 4
      const s7 = reducer(s4, ['USE', 'LR2', 'Gn'])! as GameStatePlaying
      const s8 = reducer(s7, ['COMMIT'])! as GameStatePlaying
      const s9 = reducer(s8, ['CONVERT', 'Gn'])! as GameStatePlaying
      expect(s9.players[0]).toMatchObject({
        straw: 1,
        grain: 1,
        wood: 2,
      })
      const s10 = reducer(s9, ['BUILD', 'F03', '3', '1'])! as GameStatePlaying
      expect(s10.players[0].landscape[1][3]).toStrictEqual(['P', 'F03'])
      expect(s10.players[0]).toMatchObject({
        straw: 0,
        clay: 0,
        penny: 4,
        grain: 1,
        wood: 1,
        sheep: 0,
      })
      const s11 = reducer(s10, ['USE', 'F03'])! as GameStatePlaying
      expect(s11.players[0]).toMatchObject({
        straw: 0,
        clay: 0,
        penny: 3,
        grain: 7,
        wood: 1,
        sheep: 0,
      })
    })
  })
})
