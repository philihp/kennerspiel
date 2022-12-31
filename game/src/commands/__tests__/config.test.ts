import { parser } from '../../parser'
import { initialState } from '../../reducer'
import { GameActionConfig, GameCommandConfigParams, GameStatusEnum } from '../../types'
import { config } from '../config'

describe('commands/config', () => {
  describe('config', () => {
    it('can config from setup', () => {
      expect.assertions(2)
      const dst = config(
        {
          ...initialState,
          status: GameStatusEnum.SETUP,
        },
        { players: 4, country: 'ireland', length: 'short' }
      )
      expect(dst?.config?.players).toBe(4)
      expect(dst?.rondel).toBeDefined()
    })
  })

  describe('parse', () => {
    it('exactly three params', () => {
      expect.assertions(3)
      const {
        params: { players, country, length },
      } = parser(['CONFIG', '4', 'ireland', 'long']) as GameActionConfig
      expect(players).toBe(4)
      expect(country).toBe('ireland')
      expect(length).toBe('long')
    })
    it('does not allow players under 1', () => {
      expect.assertions(1)
      expect(parser(['CONFIG', '-1', 'ireland', 'long'])).toBeUndefined()
    })
    it('does not allow non-standard country', () => {
      expect.assertions(1)
      expect(parser(['CONFIG', '3', 'syria', 'long'])).toBeUndefined()
    })
    it('does not allow a weird length', () => {
      expect.assertions(1)
      expect(parser(['CONFIG', '4', 'ireland', 'brief'])).toBeUndefined()
    })
  })
})
