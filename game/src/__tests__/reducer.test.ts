import { initialState } from '../reducer'

describe('reducer', () => {
  describe('initialState', () => {
    it('exposes an initial state', () => {
      expect.assertions(1)
      expect(initialState).toBeDefined()
    })
  })
})
