import { initialState, reducer } from '../../reducer'
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
})
