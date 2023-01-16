import { reducer, initialState } from '../../reducer'
import { GameStatePlaying } from '../../types'

describe('buildings/cloisterCourtyard', () => {
  describe('use', () => {
    it('goes through a happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '1', 'france', 'short'])!
      const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
      s2.players[0].straw = 1
      s2.players[0].clay = 1
      s2.players[0].peat = 3
      s2.players[0].penny = 3
      const s3 = reducer(s2, ['BUILD', 'G06', '3', '1'])! as GameStatePlaying
      expect(s3.players[0].landscape[1][3]).toStrictEqual(['P', 'G06'])
      expect(s3.players[0]).toMatchObject({
        straw: 0,
        clay: 0,
        nickel: 0,
        penny: 3,
      })
      const s11 = reducer(s3, ['USE', 'G06', 'PtPtPt'])! as GameStatePlaying
      expect(s11.players[0]).toMatchObject({
        clay: 0,
        grain: 0,
        peat: 0,
        nickel: 1,
        penny: 6, // ensure dont automatically upchange to nickels
        wood: 0,
      })
    })
  })
})
