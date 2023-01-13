import { differentGoods, maskGoods, multiplyGoods, parseResourceParam, totalGoods } from '../resource'
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

  describe('differentGoods', () => {
    it('counts up the different goods', () => {
      expect(differentGoods({ clay: 1, wood: 1, grain: 1 })).toBe(3)
    })
    it('does not count if value is 0', () => {
      expect(differentGoods({ clay: 1, wood: 0, grain: 1 })).toBe(2)
    })
    it('accepts empty cost', () => {
      expect(differentGoods({})).toBe(0)
    })
  })
  describe('totalGoods', () => {
    it('sums up the different goods', () => {
      expect(totalGoods({ clay: 1, wood: 1, grain: 4 })).toBe(6)
    })
    it('accepts empty cost', () => {
      expect(totalGoods({})).toBe(0)
    })
  })

  describe('multiplyGoods', () => {
    it('multiplies the goods', () => {
      expect(multiplyGoods(4)({ grain: 1, wood: 2 })).toMatchObject({
        grain: 4,
        wood: 8,
      })
    })
  })

  describe('maskGoods', () => {
    it('ands two sets together', () => {
      const out = maskGoods(['stone', 'grain', 'wood'])({ stone: 2, wood: 1, clay: 1 })
      expect(out).toMatchObject({
        stone: 2,
        wood: 1,
      })
      expect(Object.keys(out)).toContain('stone')
      expect(Object.keys(out)).toContain('wood')
      expect(Object.keys(out)).not.toContain('grain')
      expect(Object.keys(out)).not.toContain('clay')
    })
  })
})
