import { GameStatePlaying } from '../../types'
import { complete } from '../commit'

describe('commands/commit', () => {
  describe('commit', () => {
    it('stub', () => {
      expect(true).toBeTruthy()
    })
  })

  describe('complete', () => {
    it('stub', () => {
      const c0 = complete({} as GameStatePlaying, [])
      expect(c0).toStrictEqual([])
    })
  })
})
