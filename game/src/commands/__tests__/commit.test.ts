import { describe, it, expect } from '../../testHelpers'
import { BuildingEnum, Frame, GameCommandEnum, GameState } from '../../types'
import { complete } from '../commit'

describe('commands/commit', () => {
  const s0 = {
    frame: {
      mainActionUsed: true,
    } as Frame,
  } as GameState

  describe('commit', () => {
    it('stub', () => {
      expect(true).toBeTruthy()
    })
  })

  describe('complete', () => {
    it('allows commit even if main action not used (a pass)', () => {
      // The rules say each player "gets to carry out one action" — an
      // entitlement, not an obligation — so a player may pass (end their turn
      // without using the main action). This also avoids softlocking end-game
      // states where no legal action remains.
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame!,
          mainActionUsed: false,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['COMMIT'])
    })
    describe('neutral building phase', () => {
      it('does not allow commit if still buildings', () => {
        const s1 = {
          ...s0,
          buildings: [BuildingEnum.Bakery],
          frame: {
            ...s0.frame!,
            // this is set in nextFrameSolo
            neutralBuildingPhase: true,
            mainActionUsed: true,
          },
        } as GameState
        const c0 = complete(s1)([])
        expect(c0).toStrictEqual([])
      })
      it('allows commit if all buildings placed, has not settled', () => {
        const s1 = {
          ...s0,
          buildings: [],
          frame: {
            ...s0.frame!,
            // this is set in nextFrameSolo
            neutralBuildingPhase: true,
            mainActionUsed: true,
            bonusActions: [GameCommandEnum.SETTLE],
          },
        } as GameState
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
