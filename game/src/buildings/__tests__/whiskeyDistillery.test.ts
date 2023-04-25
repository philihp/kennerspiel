import { GameStatePlaying, Tableau } from '../../types'
import { whiskeyDistillery, complete } from '../whiskeyDistillery'

describe('buildings/whiskeyDistillery', () => {
  const p0 = {
    peat: 10,
    penny: 0,
    clay: 0,
    wood: 10,
    grain: 0,
    sheep: 0,
    stone: 0,
    flour: 0,
    grape: 0,
    nickel: 0,
    malt: 10,
    coal: 0,
    book: 0,
    ceramic: 0,
    whiskey: 0,
    straw: 0,
    meat: 0,
    ornament: 0,
    bread: 0,
    wine: 0,
    beer: 0,
    reliquary: 0,
  } as Tableau
  const s0 = {
    frame: {
      activePlayerIndex: 0,
    },
    players: [p0],
  } as GameStatePlaying

  describe('whiskeyDistillery', () => {
    it('goes through a happy path', () => {
      const s1 = whiskeyDistillery('MaWoPtMaWoPt')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        malt: 8,
        wood: 8,
        peat: 8,
        whiskey: 4,
      })
    })

    it('allows a noop with undefined', () => {
      const s1 = whiskeyDistillery()(s0)!
      expect(s1).toBe(s0)
    })

    it('allows a noop with empty string', () => {
      const s1 = whiskeyDistillery('')(s0)!
      expect(s1).toBe(s0)
    })

    it('retains undefined state', () => {
      const s1 = whiskeyDistillery()(undefined)!
      expect(s1).toBeUndefined()
    })

    it('only makes the minimum of the inputs', () => {
      const s1 = whiskeyDistillery('MaWoPtMaWo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        whiskey: 2,
      })
    })
    it('consumes everything given', () => {
      const s1 = whiskeyDistillery('MaMaMaPtWo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        malt: 7,
        wood: 9,
        peat: 9,
      })
    })
  })

  describe('complete', () => {
    it('offers minimum of malt, wood, peat', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            malt: 4,
            wood: 3,
            peat: 2,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['MaMaWoWoPtPt', 'MaWoPt', ''])
    })
    it('complete if given a param', () => {
      const c0 = complete(['FoFoFo'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('dont allow complete with two params', () => {
      const c0 = complete(['Fo', 'Fo'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})
