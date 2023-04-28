import { GameStatePlaying, Tableau } from '../../types'
import { camera, complete } from '../camera'

describe('buildings/camera', () => {
  const p0 = {
    book: 3,
    ceramic: 3,
    penny: 0,
    clay: 0,
    reliquary: 0,
  } as Tableau
  const s0 = {
    frame: {
      activePlayerIndex: 0,
    },
    players: [p0],
  } as GameStatePlaying

  describe('camera', () => {
    it('goes through a happy path', () => {
      const s1 = camera('BoBoCeCe')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ceramic: 1,
        penny: 2,
        clay: 2,
        reliquary: 2,
      })
    })

    it('retains undefined state', () => {
      const s1 = camera()(undefined)
      expect(s1).toBeUndefined()
    })

    it('is a noop if empty string', () => {
      const s1 = camera('')(s0)
      expect(s1).toBe(s0)
    })

    it('is a noop if undefined', () => {
      const s1 = camera()(s0)
      expect(s1).toBe(s0)
    })

    it('can only do one', () => {
      const s1 = camera('BoCe')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        book: 2,
        ceramic: 2,
        penny: 1,
        clay: 1,
        reliquary: 1,
      })
    })

    it('if paying for more than two, only give 2', () => {
      const s1 = camera('BoBoBoCeCeCe')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ceramic: 1,
        penny: 2,
        clay: 2,
        reliquary: 2,
      })
    })
  })

  describe('complete', () => {
    it('allows usage at 5 or 15', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            straw: 3,
            wood: 5,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['SwSwWoWo', 'SwWo', ''])
    })
    it('finish command after 1 param', () => {
      const s1 = {
        ...s0,
      } as GameStatePlaying
      const c0 = complete(['WoSw'])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('ignores more than one param', () => {
      const s1 = {
        ...s0,
      } as GameStatePlaying
      const c0 = complete(['Or', 'Bo'])(s1)
      expect(c0).toStrictEqual([])
    })
  })
})
