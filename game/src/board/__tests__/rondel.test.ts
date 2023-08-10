import { GameStatePlaying, Rondel, Tableau } from '../../types'
import {
  introduceGrapeToken,
  introduceStoneToken,
  standardSesourceGatheringAction,
  standardSesourceGatheringCompletion,
  take,
  updateRondel,
} from '../rondel'

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

  describe('standardSesourceGatheringAction', () => {
    describe('when both tokens usable', () => {
      const r0 = {
        pointingBefore: 8,
        grain: 5,
        joker: 2,
      } as Rondel
      const p0 = {
        grain: 1,
      } as Tableau
      const s0 = {
        rondel: r0,
        players: [p0, p0],
        config: {
          players: 2,
          length: 'long',
          country: 'france',
        },
        frame: {
          activePlayerIndex: 0,
        },
      } as GameStatePlaying
      it('takes from the grain token', () => {
        const s1 = standardSesourceGatheringAction('grain', false)(s0)!
        expect(s1.players[0].grain).toBe(5)
      })
      it('takes from the joker token', () => {
        const s1 = standardSesourceGatheringAction('grain', true)(s0)!
        expect(s1.players[0].grain).toBe(7)
      })
    })
    describe('when no joker available', () => {
      const r0 = {
        pointingBefore: 8,
        sheep: 5,
        joker: undefined,
      } as Rondel
      const p0 = {
        sheep: 1,
      } as Tableau
      const s0 = {
        rondel: r0,
        players: [p0, p0],
        config: {
          players: 2,
          length: 'long',
          country: 'france',
        },
        frame: {
          activePlayerIndex: 0,
        },
      } as GameStatePlaying
      it('takes from the sheep token', () => {
        const s1 = standardSesourceGatheringAction('sheep', false)(s0)!
        expect(s1.players[0].sheep).toBe(5)
      })
      it('does not default back to sheep when joker specified', () => {
        const s1 = standardSesourceGatheringAction('sheep', true)(s0)!
        expect(s1.players[0].sheep).toBe(1)
      })
    })
    describe('when no main token available', () => {
      const r0 = {
        pointingBefore: 8,
        sheep: undefined,
        joker: 4,
      } as Rondel
      const p0 = {
        sheep: 1,
      } as Tableau
      const s0 = {
        rondel: r0,
        players: [p0, p0],
        config: {
          players: 2,
          length: 'long',
          country: 'france',
        },
        frame: {
          activePlayerIndex: 0,
        },
      } as GameStatePlaying
      it('does not fallback to sheep token', () => {
        const s1 = standardSesourceGatheringAction('sheep', false)(s0)!
        expect(s1.players[0].sheep).toBe(1)
      })
      it('takes with the joker token', () => {
        const s1 = standardSesourceGatheringAction('sheep', true)(s0)!
        expect(s1.players[0].sheep).toBe(6)
      })
    })
  })

  describe('standardSesourceGatheringCompletion', () => {
    it('gives both options if defined', () => {
      const r0 = {
        pointingBefore: 4,
        sheep: 3,
        joker: 0,
      } as Rondel
      const s0 = {
        rondel: r0,
      } as GameStatePlaying

      const c0 = standardSesourceGatheringCompletion('sheep')([], s0)
      expect(c0).toStrictEqual(['', 'Jo'])
    })
    it('if no main token, but still joker, assume joker', () => {
      const r0 = {
        pointingBefore: 4,
        sheep: undefined,
        joker: 0,
      } as Rondel
      const s0 = {
        rondel: r0,
      } as GameStatePlaying

      const c0 = standardSesourceGatheringCompletion('sheep')([], s0)
      expect(c0).toStrictEqual([''])
    })
    it('if no joker token, but still main, assume main', () => {
      const r0 = {
        pointingBefore: 4,
        sheep: 3,
        joker: undefined,
      } as Rondel
      const s0 = {
        rondel: r0,
      } as GameStatePlaying

      const c0 = standardSesourceGatheringCompletion('sheep')([], s0)
      expect(c0).toStrictEqual([''])
    })
    it('if neither main nor joker token, no completion allowed', () => {
      const r0 = {
        pointingBefore: 4,
        sheep: undefined,
        joker: undefined,
      } as Rondel
      const s0 = {
        rondel: r0,
      } as GameStatePlaying

      const c0 = standardSesourceGatheringCompletion('sheep')([], s0)
      expect(c0).toStrictEqual([])
    })
  })
})
