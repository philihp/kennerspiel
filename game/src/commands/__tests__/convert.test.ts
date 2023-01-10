import { initialState } from '../../reducer'
import { GameStatePlaying, GameStatusEnum, PlayerColor } from '../../types'
import { config } from '../config'
import { convert } from '../convert'
import { start } from '../start'

describe('commands/convert', () => {
  const s0 = initialState
  const s1 = config(s0, { country: 'ireland', players: 1, length: 'long' })!
  const s2 = start(s1, { seed: 420, colors: [PlayerColor.White] })!

  describe('convert', () => {
    it('cannot convert undefined state', () => {
      expect(convert({})(undefined as unknown as GameStatePlaying)).toBeUndefined()
    })
    it('accepts a noop', () => {
      const s3 = convert({})(s2)
      expect(s3).toMatchObject(s2)
    })
    it('converts nickel to pennies', () => {
      const src = {
        ...s2,
        players: [
          (s2.players[0] = {
            ...s2.players[0],
            nickel: 1,
            penny: 1,
            wine: 1,
          }),
        ],
      }
      const dst = convert({ nickel: 1 })(src)!
      expect(dst.players[0]).toMatchObject({
        nickel: 0,
        penny: 6,
        wine: 1,
      })
    })
    it('converts pennies to nickel', () => {
      const src = {
        ...s2,
        players: [
          (s2.players[0] = {
            ...s2.players[0],
            nickel: 2,
            penny: 6,
            wine: 1,
          }),
        ],
      }
      const dst = convert({ penny: 5 })(src)!
      expect(dst.players[0]).toMatchObject({
        nickel: 3,
        penny: 1,
        wine: 1,
      })
    })
    it('converts wine if needed to uptoken to nickel', () => {
      const src = {
        ...s2,
        players: [
          (s2.players[0] = {
            ...s2.players[0],
            nickel: 0,
            penny: 2,
            wine: 4,
          }),
        ],
      }
      const dst = convert({ penny: 5 })(src)!
      expect(dst.players[0]).toMatchObject({
        nickel: 1,
        penny: 0,
        wine: 1,
      })
    })
    it('converts whiskey if needed to uptoken to nickel', () => {
      const src = {
        ...s2,
        players: [
          (s2.players[0] = {
            ...s2.players[0],
            nickel: 0,
            penny: 2,
            whiskey: 4,
          }),
        ],
      }
      const dst = convert({ penny: 5 })(src)!

      expect(dst.players[0]).toMatchObject({
        nickel: 1,
        penny: 1,
        whiskey: 2,
      })
    })
  })
})
