import { initialState } from '../../state'
import { GameStatePlaying, Rondel } from '../../types'
import { introduceGrapeToken, introduceStoneToken, take, updateRondel } from '../rondel'

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

  describe('introduceGrapeToken', () => {
    const r0: Rondel = {
      pointingBefore: 8,
      clay: 7,
      coin: 6,
      grain: 8,
      joker: 6,
      peat: undefined,
      sheep: 7,
      wood: 6,
      stone: undefined,
      grape: undefined,
    }
    const s0 = {
      rondel: r0,
      config: {
        country: 'france',
      },
    } as GameStatePlaying
    it('adds a grape token right behind the arm', () => {
      const s1 = introduceGrapeToken(s0)!
      expect(s1.rondel.grape).toBe(s1.rondel.pointingBefore)
    })
    it('does not add grape if not in france', () => {
      const s1: GameStatePlaying = {
        ...s0,
        config: {
          ...s0.config,
          country: 'ireland',
        },
      }
      const s2 = introduceGrapeToken(s1)!
      expect(s2.rondel.grape).toBeUndefined()
    })
    it('keeps all remaining tokens where they were', () => {
      const s1 = introduceGrapeToken(s0)!
      expect(s1.rondel).toMatchObject({
        pointingBefore: 8,
        clay: 7,
        coin: 6,
        grain: 8,
        joker: 6,
        sheep: 7,
        wood: 6,
      })
    })
    it('does not reintroduce undefined tokens', () => {
      // this can happen in solo where tokens aren't pushed forward by the arm, but
      // will rather fall off the end if the arm goes all the way around.
      // also, this will always happen with france games because the grape is introduced
      // before the stone is introduced.
      const s1 = introduceGrapeToken(s0)!
      expect(s1.rondel).toMatchObject({
        peat: undefined,
        stone: undefined,
      })
    })
    it('if introducing a token already existing, for some reason, it will do nothing', () => {
      const s1: GameStatePlaying = {
        ...s0,
        rondel: {
          ...s0.rondel,
          grape: 5,
        },
      }
      const s2 = introduceGrapeToken(s1)!
      expect(s2.rondel).toBe(s1.rondel)
    })
  })
  describe('introduceStoneToken', () => {
    const r0: Rondel = {
      pointingBefore: 8,
      clay: 7,
      coin: 6,
      grain: 8,
      joker: 6,
      peat: undefined,
      sheep: 7,
      wood: 6,
      stone: undefined,
      grape: undefined,
    }
    const s0 = {
      rondel: r0,
      config: {
        country: 'france',
      },
    } as GameStatePlaying
    it('adds a stone token right behind the arm', () => {
      const s1 = introduceStoneToken(s0)!
      expect(s1.rondel.stone).toBe(s1.rondel.pointingBefore)
    })
    it('keeps all remaining tokens where they were', () => {
      const s1 = introduceStoneToken(s0)!
      expect(s1.rondel).toMatchObject({
        pointingBefore: 8,
        clay: 7,
        coin: 6,
        grain: 8,
        joker: 6,
        sheep: 7,
        wood: 6,
      })
    })
    it('if introducing a token already existing, for some reason, it will do nothing', () => {
      const s1: GameStatePlaying = {
        ...s0,
        rondel: {
          ...s0.rondel,
          stone: 6,
        },
      }
      const s2 = introduceStoneToken(s1)!
      expect(s2.rondel).toBe(s1.rondel)
    })
  })

  describe('updateRondel', () => {
    const r0: Rondel = {
      pointingBefore: 11,
      clay: 7,
      coin: 6,
      grain: 8,
      joker: 6,
      peat: undefined,
      sheep: 7,
      wood: 6,
      stone: undefined,
      grape: undefined,
    }
    it('updates a normal token', () => {
      const r1 = updateRondel('coin')(r0)!
      expect(r1.coin).toBe(11)
    })
    it('will leave an undefined token as undefined', () => {
      const r1 = updateRondel('peat')(r0)!
      expect(r1).toBe(r0)
    })
    it('retains all other tokens how they were', () => {
      const r1 = updateRondel('coin')(r0)!
      expect(r1).toMatchObject({
        pointingBefore: 11,
        clay: 7,
        grain: 8,
        joker: 6,
        peat: undefined,
        sheep: 7,
        wood: 6,
        stone: undefined,
        grape: undefined,
      })
    })
  })
})
