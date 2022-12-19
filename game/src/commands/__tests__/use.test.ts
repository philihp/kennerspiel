import { parse, parseResourceParam } from '../use'

describe('commands/use', () => {
  describe('parse', () => {
    it('parses building out', () => {
      const parsed = parse(['LG1'])
      expect(parsed).toStrictEqual({ building: 'LG1' })
    })
    it('parses command with one param', () => {
      const parsed = parse(['LR2', 'Sh'])
      expect(parsed).toStrictEqual({ building: 'LR2', p1: ['Sh'] })
    })
    it('borks itself when building is not known', () => {
      const parsed = parse(['!!!'])
      expect(parsed).toStrictEqual({})
    })
  })

  describe('parseResourceParam', () => {
    it('parses empty string', () => {
      const src = ''
      const dst = parseResourceParam(src)
      expect(dst).toStrictEqual([])
    })
    it('returns undefined if undefined in', () => {
      expect(parseResourceParam(undefined)).toBeUndefined()
    })
    it('parses single unit', () => {
      const src = 'Pt'
      const dst = parseResourceParam(src)
      expect(dst).toStrictEqual(['Pt'])
    })
    it('parses multiple units', () => {
      const src = 'PtPtPtPt'
      const dst = parseResourceParam(src)
      expect(dst).toStrictEqual(['Pt', 'Pt', 'Pt', 'Pt'])
    })
    it('gracefull failing if odd number of chars', () => {
      const src = 'PnP'
      const dst = parseResourceParam(src)
      expect(dst).toStrictEqual(['Pn'])
    })
    it('weird values dont come out', () => {
      const src = 'Pq'
      const dst = parseResourceParam(src)
      expect(dst).toStrictEqual([])
    })
  })
})
