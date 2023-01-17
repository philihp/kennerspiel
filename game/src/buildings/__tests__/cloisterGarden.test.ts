import { reducer, initialState } from '../../reducer'
import { GameStatePlaying } from '../../types'
import { cloisterGarden } from '../cloisterGarden'

describe('buildings/cloisterGarden', () => {
  describe('use', () => {
    it('goes through a happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '1', 'france', 'short'])!
      const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
      const s3 = {
        ...s2,
        players: [
          {
            ...s2?.players[0],
            penny: 3,
          },
          s2?.players.slice(1),
        ],
      } as GameStatePlaying
      const s4 = reducer(s3, ['BUILD', 'F09', '3', '1'])! as GameStatePlaying
      expect(s4.players[0]).toMatchObject({
        penny: 0,
      })
      const s5 = cloisterGarden('F09')(s4)! as GameStatePlaying
      expect(s5.players[0]).toMatchObject({
        grape: 1,
      })
    })
  })
})
