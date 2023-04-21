import { Cost } from '../../types'
import {
  combinations,
  costEnergy,
  differentGoods,
  foodCostOptions,
  maskGoods,
  multiplyGoods,
  parseResourceParam,
  settlementCostOptions,
  totalGoods,
} from '../resource'

describe('board/resource', () => {
  describe('combinations', () => {
    it('gives all combinations of two', () => {
      const c = combinations(2, ['a', 'b', 'c', 'd'])
      expect(c).toStrictEqual(['ab', 'ac', 'ad', 'bc', 'bd', 'cd'])
    })
    it('works on an empty array', () => {
      const c = combinations(3, [])
      expect(c).toStrictEqual([])
    })
    it('max length 1 returns same thing', () => {
      const c = combinations(1, ['a', 'b', 'c', 'd'])
      expect(c).toStrictEqual(['a', 'b', 'c', 'd'])
    })
    it('max length 0 returns empty', () => {
      const c = combinations(0, ['a', 'b', 'c', 'd'])
      expect(c).toStrictEqual([])
    })
  })

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
    it('supports backward compatibility of Po to Ce', () => {
      const res = 'Po'
      expect(parseResourceParam(res)).toMatchObject({
        ceramic: 1,
      })
    })
    it('supports backward compatibility of Ho to Ma', () => {
      const res = 'Ho'
      expect(parseResourceParam(res)).toMatchObject({
        malt: 1,
      })
    })
    it('ignores weird values', () => {
      const res = 'Xx'
      expect(parseResourceParam(res)).toStrictEqual({})
    })
    it('handles an empty string', () => {
      const res = ''
      expect(parseResourceParam(res)).toMatchObject({})
    })
  })

  describe('foodCostOptions', () => {
    it('when sheep and grain, gives exact without overpay on sheep', () => {
      const options = foodCostOptions(2, { sheep: 1, grain: 1, grape: 1 })
      expect(options).toStrictEqual(['Sh', 'GnGp'])
      // notably it does not try GnSh or GpSh
    })
    it('will possibly pay 1 sheep for 1 food', () => {
      const options = foodCostOptions(1, { sheep: 1, grain: 1, grape: 1 })
      // overpays are allowed, if it must happen
      expect(options).toStrictEqual(['Sh', 'Gn', 'Gp'])
    })
    it('would pay two sheep for 3 food, or combine with others', () => {
      const options = foodCostOptions(3, { sheep: 2, grain: 1, grape: 1 })
      // overpays are allowed, if it must happen
      expect(options).toStrictEqual(['ShSh', 'ShGn', 'ShGp'])
    })
    it('possibilities for 3 food, infinite grape', () => {
      const options = foodCostOptions(3, { sheep: 2, grain: 1, grape: 3 })
      expect(options).toStrictEqual(['ShSh', 'ShGn', 'GpGpGp', 'GnGpGp', 'ShGp'])
    })
    it('possibilities for 3 food with only pennies', () => {
      const options = foodCostOptions(3, { penny: 4 })
      expect(options).toStrictEqual(['PnPnPn'])
    })
    it('lots of stuff for lots of food', () => {
      const options = foodCostOptions(10, { meat: 3, sheep: 2, grain: 4, penny: 2 })
      expect(options).toStrictEqual([
        'MtMt',
        'MtShGnGnGn',
        'MtShShGn',
        'ShShGnGnGnGnPnPn',
        'MtGnGnGnPnPn',
        'MtGnGnGnGnPn',
        'MtShGnPnPn',
        'MtShGnGnPn',
        'MtShShPn',
      ])
    })
  })

  describe('settlementCostOptions', () => {
    it('mutates', () => {
      const options = settlementCostOptions({ food: 2, energy: 1 }, {
        peat: 1,
        wood: 1,
        sheep: 2,
        grain: 1,
        penny: 1,
      } as Cost)
      expect(options).toStrictEqual(['ShPt', 'ShWo', 'GnPnPt', 'GnPnWo'])
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
  describe('costEnergy', () => {
    it('looks at coal', () => {
      expect(costEnergy({ coal: 4 })).toBe(12)
    })
    it('looks at peat', () => {
      expect(costEnergy({ peat: 4 })).toBe(8)
    })
    it('looks at wood', () => {
      expect(costEnergy({ wood: 4 })).toBe(4)
    })
    it('looks at straw', () => {
      expect(costEnergy({ straw: 5 })).toBe(2.5)
    })
    it('combines items', () => {
      expect(costEnergy({ coal: 1, peat: 1, wood: 1, straw: 1 })).toBe(6.5)
    })
  })
})
