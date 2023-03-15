import { GameStatePlaying, Tableau } from '../../types'
import { alehouse } from '../alehouse'

describe('buildings/alehouse', () => {
  describe('alehouse', () => {
    const p0 = {
      whiskey: 2,
      beer: 2,
      penny: 0,
      nickel: 0,
    } as Tableau
    const s0 = {
      frame: {
        activePlayerIndex: 0,
      },
      players: [p0],
    } as GameStatePlaying

    it('goes through a happy path', () => {
      const s1 = alehouse('WhBe')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        whiskey: 1,
        beer: 1,
        penny: 0,
        nickel: 3,
      })
    })

    it('retains undefined state', () => {
      const s1 = alehouse()(undefined)
      expect(s1).toBeUndefined()
    })

    it('is a noop if empty string', () => {
      const s1 = alehouse('')(s0)
      expect(s1).toBe(s0)
    })

    it('is a noop if undefined', () => {
      const s1 = alehouse()(s0)
      expect(s1).toBe(s0)
    })

    it('can only do beer', () => {
      const s1 = alehouse('Be')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        whiskey: 2,
        beer: 1,
        nickel: 1,
        penny: 3,
      })
    })

    it('can only do whiskey', () => {
      const s1 = alehouse('Wh')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        whiskey: 1,
        beer: 2,
        nickel: 1,
        penny: 2,
      })
    })
  })
})
