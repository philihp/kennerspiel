import { initialState } from '../../reducer'
import { PlayerColor, Tableau } from '../../types'
import { getPlayer, setPlayer } from '../player'

const p: Tableau = {
  color: PlayerColor.Red,
  clergy: [],
  landscape: [[]],
  settlements: [],
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
  describe('getPlayer', () => {
    it('gets the active player', () => {
      expect.assertions(1)
      const p0: Tableau = { ...p, coal: 1 }
      const p1: Tableau = { ...p, meat: 1 }
      const p2: Tableau = { ...p, beer: 1 }
      const src = { ...initialState, activePlayerIndex: 1, players: [p0, p1, p2] }
      expect(getPlayer(src)?.meat).toBe(1)
    })
    it('gets the indexed player', () => {
      expect.assertions(1)
      const p0: Tableau = { ...p, coal: 1 }
      const p1: Tableau = { ...p, meat: 1 }
      const p2: Tableau = { ...p, beer: 1 }
      const src = { ...initialState, activePlayerIndex: 1, players: [p0, p1, p2] }
      expect(getPlayer(src, 0)?.coal).toBe(1)
    })
    it('returns undefined if no players', () => {
      expect.assertions(1)
      const src = { ...initialState, activePlayerIndex: 1, players: undefined }
      expect(getPlayer(src)).toBeUndefined()
    })
    it('out of bounds returns undefined', () => {
      expect.assertions(1)
      const src = { ...initialState, activePlayerIndex: 4, players: [p, p, p] }
      expect(getPlayer(src)).toBeUndefined()
    })
  })
  describe('setPlayer', () => {
    it('sets the active player only', () => {
      expect.assertions(4)
      const src = { ...initialState, activePlayerIndex: 2, players: [p, p, p, p] }
      const player: Tableau = { ...p, wood: 5 }
      const dst = setPlayer(src, player)
      expect(dst?.players?.[0].wood).toBe(0)
      expect(dst?.players?.[1].wood).toBe(0)
      expect(dst?.players?.[2].wood).toBe(5)
      expect(dst?.players?.[3].wood).toBe(0)
    })
    it('sets the indexed player', () => {
      expect.assertions(4)
      const src = { ...initialState, activePlayerIndex: 2, players: [p, p, p, p] }
      const player: Tableau = { ...p, wood: 5 }
      const dst = setPlayer(src, player, 1)
      expect(dst?.players?.[0].wood).toBe(0)
      expect(dst?.players?.[1].wood).toBe(5)
      expect(dst?.players?.[2].wood).toBe(0)
      expect(dst?.players?.[3].wood).toBe(0)
    })
  })
})
