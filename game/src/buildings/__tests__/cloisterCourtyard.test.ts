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
      const s1 = reducer(s0, ['CONFIG', '3', 'france', 'short'])!
      const s2 = reducer(s1, ['START', '42', 'R', 'B', 'G'])! as GameStatePlaying
      const s3 = reducer(s2, ['FELL_TREES', '1', '0'])! as GameStatePlaying
      const s4 = reducer(s3, ['BUILD', 'G02', '3', '1'])! as GameStatePlaying
      expect(s4.players[0].landscape[1][3]).toStrictEqual(['P', 'G02'])
      expect(s4.players[0]).toMatchObject({
        clay: 1,
        wood: 1,
        grain: 2,
        sheep: 2,
        penny: 1,
      })
      const s5 = reducer(s4, ['USE', 'G02', 'ClWoGn', 'Sh'])! as GameStatePlaying
      expect(s5.players[0]).toMatchObject({
        clay: 0,
        wood: 0,
        grain: 1,
        sheep: 8,
        penny: 1,
      })
    })
  })
})
