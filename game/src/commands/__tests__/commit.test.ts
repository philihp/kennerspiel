import { BuildingEnum, Frame, GameCommandEnum, GameStatePlaying } from '../../types'
import { complete } from '../commit'

describe('commands/commit', () => {
  const s0 = {
    frame: {
      mainActionUsed: true,
    } as Frame,
  } as GameStatePlaying

  describe('commit', () => {
    it('stub', () => {
      expect(true).toBeTruthy()
    })
  })

  describe('complete', () => {
    it('does not allow commit if main action not used', () => {
      // this was a bit of a judgement call. the rules say each player "gets to carry out an action", but
      // i can't figure out a single instance where a player would want to pass on this, so i'm going to say
      // no commits without doing a thing
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: false,
        } as Frame,
      } as GameStatePlaying
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    describe('neutral building phase', () => {
      it('does not allow commit if still buildings', () => {
        const s1 = {
          ...s0,
          buildings: [BuildingEnum.Bakery],
          frame: {
            ...s0.frame,
            // this is set in nextFrameSolo
            neutralBuildingPhase: true,
            mainActionUsed: true,
          } as Frame,
        } as GameStatePlaying
        const c0 = complete(s1)([])
        expect(c0).toStrictEqual([])
      })
      it('allows commit if all buildings placed, has not settled', () => {
        const s1 = {
          ...s0,
          buildings: [],
          frame: {
            ...s0.frame,
            // this is set in nextFrameSolo
            neutralBuildingPhase: true,
            mainActionUsed: true,
            bonusActions: [GameCommandEnum.SETTLE],
          } as Frame,
        } as GameStatePlaying
        const c0 = complete(s1)([])
        expect(c0).toStrictEqual(['COMMIT'])
      })
    })
    it('allows commit if main action used', () => {
      const c0 = complete(s0)([])
      expect(c0).toStrictEqual(['COMMIT'])
    })
    it('allows submit, because COMMIT has no parameters', () => {
      const c0 = complete(s0)([GameCommandEnum.COMMIT])
      expect(c0).toStrictEqual([''])
    })
  })
})
