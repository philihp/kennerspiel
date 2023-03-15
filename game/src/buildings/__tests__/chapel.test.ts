import { GameStatePlaying, Tableau } from '../../types'
import { chapel } from '../chapel'

describe('buildings/chapel', () => {
  describe('chapel', () => {
    const p0 = {
      peat: 0,
      penny: 0,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      malt: 0,
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
      players: [{ ...p0 }],
    } as GameStatePlaying

    it('goes through a happy path', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...p0,
            penny: 1,
            beer: 3,
            whiskey: 3,
          },
        ],
      }
      const s2 = chapel('PnWhBeWhBeWhBe')(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 0,
        beer: 0,
        whiskey: 0,
        book: 1,
        reliquary: 3,
      })
    })

    it('retains undefined', () => {
      const s1 = chapel()(undefined)!
      expect(s1).toBeUndefined()
    })

    it('allows noop with no params', () => {
      const s1 = chapel()(s0)!
      expect(s1).toBe(s0)
    })

    it('allows noop with empty string', () => {
      const s1 = chapel('')(s0)!
      expect(s1).toBe(s0)
    })

    it('eats everything its given', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...p0,
            penny: 1,
            beer: 5,
            whiskey: 5,
          },
        ],
      }
      const s2 = chapel('PnWhBeWhBeWhBeWhBe')(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 0,
        beer: 1,
        whiskey: 1,
        book: 1,
        reliquary: 3, // still only gives 3 of the thing
      })
    })

    it('can optionally only do the books', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...p0,
            penny: 1,
            beer: 5,
            whiskey: 5,
          },
        ],
      }
      const s2 = chapel('Pn')(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 0,
        beer: 5,
        whiskey: 5,
        book: 1,
        reliquary: 0,
      })
    })

    it('can be under-given booze', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...p0,
            penny: 1,
            beer: 2,
            whiskey: 5,
          },
        ],
      }
      const s2 = chapel('BeWh')(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 1,
        beer: 1,
        whiskey: 4,
        book: 0,
        reliquary: 1,
      })
    })
  })
})
