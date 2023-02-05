import { initialState } from '../../reducer'
import { PlayerColor } from '../../types'
import { commit } from '../commit'
import { config } from '../config'
import { start } from '../start'

describe('commands/commit', () => {
  describe('commit', () => {
    it('can commit from playing', () => {
      expect.assertions(2)
      const s0 = initialState
      const s1 = config(s0, {
        players: 3,
        country: 'ireland',
        length: 'long',
      })
      const s2 = start(s1!, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue] })
      const s3 = commit(s2!)
      expect(s2?.turn?.activePlayerIndex).toBe(0)
      expect(s3?.turn?.activePlayerIndex).toBe(1)
    })

    it('wrap around active player index', () => {
      expect.assertions(1)
      const s0 = initialState
      const s1 = config(s0, {
        players: 3,
        country: 'ireland',
        length: 'long',
      })
      const s2 = {
        ...start(s1!, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue] })!,
        activePlayerIndex: 2,
      }

      const s3 = commit(s2!)
      expect(s3?.turn?.activePlayerIndex).toBe(0)
    })
  })
})
