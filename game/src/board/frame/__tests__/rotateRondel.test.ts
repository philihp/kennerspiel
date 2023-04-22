import { GameStatePlaying } from '../../../types'
import { rotateRondel, rotateRondelWithExpire } from '../rotateRondel'

describe('board/frame', () => {
  const s0 = {
    rondel: {
      pointingBefore: 4,
      wood: 3,
      clay: 4,
      coin: 1,
      joker: 4,
      grain: 0,
    },
  } as GameStatePlaying

  describe('rotateRondel', () => {
    it('rotates things forward, normally', () => {
      const s1 = {
        ...s0,
      }
      const s2 = rotateRondel(s1)
      expect(s2).toMatchObject({
        rondel: {
          pointingBefore: 5,
          wood: 3,
          clay: 4,
          coin: 1,
          joker: 4,
          grain: 0,
          stone: undefined,
        },
      })
    })

    it('pushes things at max to their next level', () => {
      const s1 = {
        ...s0,
        rondel: {
          ...s0.rondel,
          pointingBefore: 5,
          wood: 3,
          clay: 6,
          coin: 1,
          joker: 6,
          grain: 0,
        },
      }
      const s2 = rotateRondel(s1)
      expect(s2).toMatchObject({
        rondel: {
          pointingBefore: 6,
          wood: 3,
          clay: 7,
          coin: 1,
          joker: 7,
          grain: 0,
          stone: undefined,
        },
      })
    })

    it('wraps around at 13', () => {
      const s1 = {
        ...s0,
        rondel: {
          ...s0.rondel,
          pointingBefore: 12,
          wood: 12,
          clay: 11,
          grain: 0,
          coin: 1,
          joker: 2,
        },
      }
      const s2 = rotateRondel(s1)
      expect(s2).toMatchObject({
        rondel: {
          pointingBefore: 0,
          wood: 12,
          clay: 11,
          grain: 1,
          coin: 1,
          joker: 2,
        },
      })
    })
  })
  describe('rotateRondelWithExpire', () => {
    it('lets things drop off in solo mode', () => {
      const s1 = {
        ...s0,
        rondel: {
          ...s0.rondel,
          pointingBefore: 5,
          wood: 3,
          clay: 6,
          coin: 1,
          joker: 6,
          grain: 0,
        },
      }
      const s2 = rotateRondelWithExpire(s1)
      expect(s2).toMatchObject({
        rondel: {
          pointingBefore: 6,
          wood: 3,
          clay: undefined,
          coin: 1,
          joker: undefined,
          grain: 0,
          stone: undefined,
        },
      })
    })
  })
})
