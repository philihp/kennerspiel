import { take } from '../rondel'

describe('board/rondel', () => {
  describe('take', () => {
    it('can take from zero', () => {
      expect(take(0, 0, { country: 'france', length: 'long', players: 4 })).toBe(0)
    })
    it('can take from one ahead', () => {
      expect(take(1, 0, { country: 'france', length: 'long', players: 4 })).toBe(2)
    })
    it('can take from one ahead, but if both are ahead', () => {
      expect(take(5, 4, { country: 'france', length: 'long', players: 4 })).toBe(2)
    })
    it('wraps around', () => {
      expect(take(0, 12, { country: 'france', length: 'long', players: 4 })).toBe(2)
    })
    it('uses arm lookup for higher increment', () => {
      expect(take(10, 1, { country: 'france', length: 'long', players: 4 })).toBe(8)
    })
    it('uses arm lookup, wrapping around', () => {
      expect(take(3, 10, { country: 'france', length: 'long', players: 4 })).toBe(6)
    })

    it('uses different numbers for 2p short', () => {
      expect(take(1, 0, { country: 'france', length: 'short', players: 2 })).toBe(1)
    })
  })
})
