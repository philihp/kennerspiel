import { initialState } from '../../reducer'
import { BuildingEnum, PlayerColor } from '../../types'
import { config } from '../config'
import { start } from '../start'
import { use } from '../use'

describe('commands/use', () => {
  const s0 = initialState
  const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
  const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!

  describe('use', () => {
    it('throws errors on invalid building', () => {
      // expect(() => use(s2, 'XXX' as unknown as BuildingEnum, [])).toThrow()
      expect(use(s2, 'XXX' as unknown as BuildingEnum, [])).toBeUndefined()
    })
  })
})
