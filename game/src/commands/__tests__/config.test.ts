import { initialState } from '../../reducer'
import { GameCommandConfigParams, GameStatusEnum } from '../../types'
import { config, parse } from '../config'

describe('commands/config', () => {
  describe('config', () => {
    const params: GameCommandConfigParams = { players: 2, country: 'ireland', length: 'long' }
    it('cannot config from playing', () => {
      expect.assertions(1)
      const src = {
        ...initialState,
        status: GameStatusEnum.PLAYING,
      }
      const dst = config(src, params)
      expect(dst).toBeUndefined()
    })

    it('cannot config from finished', () => {
      expect.assertions(1)
      const src = {
        ...initialState,
        status: GameStatusEnum.FINISHED,
      }
      const dst = config(src, params)
      expect(dst).toBeUndefined()
    })

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
      const { players, country, length } = parse(['4', 'ireland', 'long'])
      expect(players).toBe(4)
      expect(country).toBe('ireland')
      expect(length).toBe('long')
    })
    it('does not allow players under 1', () => {
      expect.assertions(3)
      const { players, country, length } = parse(['-1', 'ireland', 'long'])
      expect(players).toBeUndefined()
      expect(country).toBeUndefined()
      expect(length).toBeUndefined()
    })
    it('does not allow non-standard country', () => {
      expect.assertions(3)
      const { players, country, length } = parse(['3', 'syria', 'long'])
      expect(players).toBeUndefined()
      expect(country).toBeUndefined()
      expect(length).toBeUndefined()
    })
    it('does not allow a weird length', () => {
      expect.assertions(3)
      const { players, country, length } = parse(['4', 'ireland', 'brief'])
      expect(players).toBeUndefined()
      expect(country).toBeUndefined()
      expect(length).toBeUndefined()
    })
  })
})
