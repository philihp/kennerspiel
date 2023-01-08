import { parseResourceParam } from '../resource'
import { take } from '../wheel'

describe('board/resource', () => {
  describe('parseResourceParam', () => {
    it('parses a string of only one thing', () => {
      const res = 'Cl'
      expect(parseResourceParam(res)).toMatchObject({
        clay: 1,
      })
    })
    it('parses a string of stuff', () => {
      const res = 'WoWoPtGnGn'
      expect(parseResourceParam(res)).toMatchObject({
        wood: 2,
        peat: 1,
        grain: 2,
      })
    })
    it('ignores a joker, if present', () => {
      const res = 'RqJoSn'
      expect(parseResourceParam(res)).toMatchObject({
        reliquary: 1,
        stone: 1,
      })
    })
    it('handles an empty string', () => {
      const res = ''
      expect(parseResourceParam(res)).toMatchObject({})
    })
  })
})
