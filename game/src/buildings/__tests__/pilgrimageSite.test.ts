import { reducer, initialState } from '../../reducer'
import { GameStatePlaying } from '../../types'

describe('buildings/pilgrimmageSite', () => {
  describe('use', () => {
    it('baseline happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '4', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R', 'B', 'G', 'W'])! as GameStatePlaying
      expect(s2).toBeDefined()
    })
  })
})
