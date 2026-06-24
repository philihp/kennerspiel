import { describe, it, test, expect } from '../../testHelpers'
import { spiel } from '../../spiel'
import { Cost, GameState } from '../../types'
import {
  combinations,
  costEnergy,
  differentGoods,
  foodCostOptions,
  goodsPoints,
  maskGoods,
  multiplyGoods,
  parseResourceParam,
  rewardCostOptions,
  settlementCostOptions,
  shortGameBonusProduction,
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
      const options = settlementCostOptions(
        { food: 2, energy: 1 },
        {
          peat: 1,
          wood: 1,
          sheep: 2,
          grain: 1,
          penny: 1,
        }
      )
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

  describe('goodsPoints', () => {
    it('scores nickel at 2 each', () => {
      expect(goodsPoints({ nickel: 3 })).toBe(6)
    })
    it('scores whiskey/wine at 1 each, penny at 0 when no conversion helps', () => {
      expect(goodsPoints({ wine: 2, whiskey: 1, penny: 0 })).toBe(3)
    })
    it('scores reliquary/ornament/ceramic/book', () => {
      expect(goodsPoints({ reliquary: 1, ornament: 1, ceramic: 1, book: 1 })).toBe(17)
    })
    it('upgrades 5 pennies into a nickel for +2', () => {
      expect(goodsPoints({ penny: 5 })).toBe(2)
    })
    it('uses wine to complete a nickel when 4 pennies are stranded', () => {
      // 4p + 1w naive = 1; converting wine to penny then 5p->n = 2
      expect(goodsPoints({ penny: 4, wine: 1 })).toBe(2)
    })
    it('uses whiskey to complete a nickel when 3 pennies are stranded', () => {
      // 3p + 1Wh naive = 1; whiskey->2p then 5p->n = 2
      expect(goodsPoints({ penny: 3, whiskey: 1 })).toBe(2)
    })
    it('keeps wine as-is when conversion would cost more than it gains', () => {
      // 5w naive = 5; converting all to pennies then 1 nickel = 2. Keep wine.
      expect(goodsPoints({ wine: 5 })).toBe(5)
    })
    it('only sacrifices one wine even with many available', () => {
      // 4p + 6w naive = 6; sacrifice 1 wine to make a nickel = 2 + 5 = 7
      expect(goodsPoints({ penny: 4, wine: 6 })).toBe(7)
    })
    it('forms multiple nickels when pennies allow', () => {
      // 9p + 1w naive = 1; convert wine -> 10p -> 2 nickels = 4
      expect(goodsPoints({ penny: 9, wine: 1 })).toBe(4)
    })
    it('combines whiskey and pennies optimally', () => {
      // 4p + 1Wh naive = 1; whiskey->2p, 5p->n, 1p leftover = 2
      expect(goodsPoints({ penny: 4, whiskey: 1 })).toBe(2)
    })
    it('does not over-convert when it would be a net loss', () => {
      // 2p + 1w + 1Wh naive = 2; any conversion to reach nickel costs >= 2. Keep as-is.
      expect(goodsPoints({ penny: 2, wine: 1, whiskey: 1 })).toBe(2)
    })
    it('leaves existing nickels untouched', () => {
      expect(goodsPoints({ nickel: 2, penny: 4, wine: 1 })).toBe(4 + 2)
    })
  })

  describe('shortGameBonusProduction', () => {
    test('does not give resources in short 2p game', () => {
      const s0 = spiel`
        CONFIG 2 france short
        START B W`!
      const s1 = shortGameBonusProduction({ reliquary: 1 })(s0)!
      expect(s1.players![0].reliquary).toBe(0)
      expect(s1.players![1].reliquary).toBe(0)
    })
    test('dispenses resources in short 3p game', () => {
      const s0 = spiel`
        CONFIG 3 france short
        START B W R`!
      const s1 = shortGameBonusProduction({ reliquary: 1 })(s0)!
      expect(s1.players![0].reliquary).toBe(1)
      expect(s1.players![1].reliquary).toBe(1)
      expect(s1.players![2].reliquary).toBe(1)
    })
    test('dispenses resources in short 4p game', () => {
      const s0 = spiel`
        CONFIG 4 france short
        START B W G R`!
      const s1 = shortGameBonusProduction({ stone: 1 })(s0)!
      expect(s1.players![0].stone).toBe(1)
      expect(s1.players![1].stone).toBe(1)
      expect(s1.players![2].stone).toBe(1)
      expect(s1.players![3].stone).toBe(1)
    })
    test('does not give resources in long 3p game', () => {
      const s0 = spiel`
        CONFIG 3 france long
        START B W R`!
      const s1 = shortGameBonusProduction({ reliquary: 1 })(s0)!
      expect(s1.players![0].reliquary).toBe(0)
      expect(s1.players![1].reliquary).toBe(0)
      expect(s1.players![2].reliquary).toBe(0)
    })
    test('does not give resources in long 2p game', () => {
      const s0 = spiel`
        CONFIG 2 france long
        START W R`!
      const s1 = shortGameBonusProduction({ reliquary: 1 })(s0)!
      expect(s1.players![0].reliquary).toBe(0)
      expect(s1.players![1].reliquary).toBe(0)
    })
    test('does not give resources in long 4p game', () => {
      const s0 = spiel`
        CONFIG 4 france long
        START B W G R`!
      const s1 = shortGameBonusProduction({ stone: 1 })(s0)!
      expect(s1.players![0].stone).toBe(0)
      expect(s1.players![1].stone).toBe(0)
      expect(s1.players![2].stone).toBe(0)
      expect(s1.players![3].stone).toBe(0)
    })
  })

  // Regression for the House of the Brotherhood (F10) bug observed in
  // instance 2952eea3-1e7b-4827-8a9f-9302a38931ad: with 14 points of entitlement
  // (7 cloisters in a 4p long game), the player should be able to take
  // Book + Ornament + Reliquary (2 + 4 + 8 = 14), but the option was missing.
  describe('rewardCostOptions', () => {
    it('includes RqOrBo (Book + Ornament + Reliquary) for 14 points', () => {
      const options = rewardCostOptions(14)
      expect(options).toContain('RqOrBo')
    })

    it('includes OrOrOrBo (3 Ornaments + Book) for 14 points', () => {
      const options = rewardCostOptions(14)
      expect(options).toContain('OrOrOrBo')
    })

    it('includes OrBo (Book + Ornament) for 6 points', () => {
      // 4 + 2 = 6 — a real, in-budget combination that the algorithm currently misses
      // because the Ornament stage prunes branches whose leftover is < 3 (Ceramic cost)
      // even though a Book (2 points) could still fit.
      const options = rewardCostOptions(6)
      expect(options).toContain('OrBo')
    })

    it('includes Rq, OrOr, OrCeBo, and CeCeCe for 9 points', () => {
      const options = rewardCostOptions(9)
      expect(options).toContain('Rq')
      expect(options).toContain('OrOr')
      expect(options).toContain('OrCeBo')
      expect(options).toContain('CeCeCe')
    })

    it('includes RqBo, OrOrBo, BoBoBoBoBo, and CeCeCe for 10 points', () => {
      const options = rewardCostOptions(10)
      expect(options).toContain('RqBo')
      expect(options).toContain('OrOrBo')
      expect(options).toContain('BoBoBoBoBo')
      expect(options).toContain('CeCeCe')
    })

    it('includes RqBo, CeCeCeBo, and RqCe for 11 points', () => {
      const options = rewardCostOptions(11)
      expect(options).toContain('RqBo')
      expect(options).toContain('CeCeCeBo')
      expect(options).toContain('RqCe')
    })

    it('includes RqOr, RqCe, and RqBoBo for 12 points', () => {
      const options = rewardCostOptions(12)
      expect(options).toContain('RqOr')
      expect(options).toContain('RqCe')
      expect(options).toContain('RqBoBo')
    })
  })
})
