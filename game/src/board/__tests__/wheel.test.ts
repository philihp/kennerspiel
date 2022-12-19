import { take } from '../wheel'

describe('board/wheel', () => {
  describe('take', () => {
    it('can take from zero', () => {
      expect(take(0, 0, { length: 'long', players: 4 })).toBe(0)
    })
    it('can take from one ahead', () => {
      expect(take(0, 1, { length: 'long', players: 4 })).toBe(2)
    })
    it('can take from one ahead, but if both are ahead', () => {
      expect(take(4, 5, { length: 'long', players: 4 })).toBe(2)
    })
    it('wraps around', () => {
      expect(take(12, 0, { length: 'long', players: 4 })).toBe(2)
    })
    it('uses arm lookup for higher increment', () => {
      expect(take(1, 10, { length: 'long', players: 4 })).toBe(8)
    })
    it('uses arm lookup, wrapping around', () => {
      expect(take(10, 3, { length: 'long', players: 4 })).toBe(6)
    })
  })
})
