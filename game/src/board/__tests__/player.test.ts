import { initialState } from '../../reducer'
import { Tableau } from '../../types'
import { getActivePlayer, setActivePlayer } from '../player'

const p: Tableau = {
  clergy: [],
  landscape: [],
  peat: 0,
  penny: 0,
  clay: 0,
  wood: 0,
  grain: 0,
  sheep: 0,
  stone: 0,
  flour: 0,
  grapes: 0,
  nickel: 0,
  hops: 0,
  coal: 0,
  book: 0,
  pottery: 0,
  whiskey: 0,
  straw: 0,
  meat: 0,
  ornament: 0,
  bread: 0,
  wine: 0,
  beer: 0,
  reliquary: 0,
}

describe('board/player', () => {
  describe('getActivePlayer', () => {
    it('gets the active player', () => {
      expect.assertions(1)
      const p1 = { ...p }
      const p2 = { ...p }
      const p3 = { ...p }
      const src = { ...initialState, activePlayerIndex: 1, players: [p1, p2, p3] }
      expect(getActivePlayer(src)).toBe(p2)
    })
    it('returns undefined if no players', () => {
      expect.assertions(1)
      const src = { ...initialState, activePlayerIndex: 1, players: undefined }
      expect(getActivePlayer(src)).toBeUndefined()
    })
    it('out of bounds returns undefined', () => {
      expect.assertions(1)
      const src = { ...initialState, activePlayerIndex: 4, players: [p, p, p] }
      expect(getActivePlayer(src)).toBeUndefined()
    })
  })
  describe('setActivePlayer', () => {
    it('sets the active player only', () => {
      expect.assertions(4)
      const src = { ...initialState, activePlayerIndex: 2, players: [p, p, p, p] }
      const player: Tableau = { ...p, wood: 5 }
      const dst = setActivePlayer(src, player)
      expect(dst?.players?.[0].wood).toBe(0)
      expect(dst?.players?.[1].wood).toBe(0)
      expect(dst?.players?.[2].wood).toBe(5)
      expect(dst?.players?.[3].wood).toBe(0)
    })
  })
})
