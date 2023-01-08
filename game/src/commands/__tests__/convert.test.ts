import { initialState } from '../../reducer'
import { GameStatePlaying, GameStatusEnum, PlayerColor } from '../../types'
import { config } from '../config'
import { convert } from '../convert'

describe('commands/convert', () => {
  describe('convert', () => {
    it('cannot convert undefined state', () => {
      expect(convert({})(undefined as unknown as GameStatePlaying)).toBeUndefined()
    })
  })
})
