import { GameStatePlaying, Tableau } from '../../types'
import { alehouse, complete } from '../alehouse'

describe('buildings/alehouse', () => {
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

  describe('alehouse', () => {
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

  describe('complete', () => {
    it('gives all combinations of beer and whiskey', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            beer: 2,
            whiskey: 2,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['BeWh', 'Be', 'Wh', ''])
    })
    it('only beer, then beer or nothing', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            beer: 2,
            whiskey: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['Be', ''])
    })
    it('only whiskey, then whiskey or nothing', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            whiskey: 2,
            beer: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['Wh', ''])
    })
    it('complete if given a param', () => {
      const c0 = complete(['BeWh'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('dont allow complete with two params', () => {
      const c0 = complete(['Be', 'Wh'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
