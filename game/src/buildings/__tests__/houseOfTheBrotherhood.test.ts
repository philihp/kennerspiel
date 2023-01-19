import { reducer, initialState } from '../../reducer'
import { GameStatePlaying } from '../../types'
import { houseOfTheBrotherhood } from '../houseOfTheBrotherhood'

describe('buildings/houseOfTheBrotherhood', () => {
  describe('houseOfTheBrotherhood', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = houseOfTheBrotherhood()(s0)
      expect(s1).toBeUndefined()
    })
    it('baseline happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '4', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R', 'B', 'G', 'W'])! as GameStatePlaying
      expect(s2).toBeDefined()
    })
  })
})
