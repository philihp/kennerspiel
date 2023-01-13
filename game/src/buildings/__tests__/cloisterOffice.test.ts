import { config } from '../../commands/config'
import { start } from '../../commands/start'
import { reducer, initialState } from '../../reducer'
import { BuildingEnum, GameStatePlaying, PlayerColor, ResourceEnum } from '../../types'
import { clayMound } from '../clayMound'

describe('buildings/clayMound', () => {
  describe('use', () => {
    it('goes through a happy path', () => {
      expect.assertions(7)
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '2', 'france', 'short'])!
      expect(s1).toBeDefined()
      const s2 = reducer(s1, ['START', '42', 'R', 'G'])! as GameStatePlaying
      expect(s2).toBeDefined()
      expect(s2.activePlayerIndex).toBe(0)
      expect(s2.players[0].penny).toBe(1)
      const s3 = reducer(s2, ['USE', 'LG3'])! as GameStatePlaying
      expect(s3.rondel.joker).not.toBe(s3.rondel.pointingBefore)
      expect(s3.rondel.coin).toBe(s3.rondel.pointingBefore)
      expect(s3.players[0].penny).toBe(2)
    })
    it('can use the joker', () => {
      expect.assertions(7)
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '3', 'france', 'short'])!
      expect(s1).toBeDefined()
      const s2 = reducer(s1, ['START', '42', 'R', 'B', 'G'])! as GameStatePlaying
      expect(s2).toBeDefined()
      expect(s2.activePlayerIndex).toBe(0)
      expect(s2.players[0].clay).toBe(1)
      const s3 = reducer(s2, ['USE', 'LR3', 'Jo'])! as GameStatePlaying
      expect(s3.rondel.joker).toBe(s3.rondel.pointingBefore)
      expect(s3.rondel.coin).not.toBe(s3.rondel.pointingBefore)
      expect(s3.players[0].penny).toBe(3)
    })
  })
})
