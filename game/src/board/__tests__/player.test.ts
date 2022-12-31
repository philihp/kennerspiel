import { config } from '../../commands/config'
import { start } from '../../commands/start'
import { initialState } from '../../reducer'
import { GameStatePlaying, PlayerColor, Tableau } from '../../types'
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
      expect.assertions(3)
      const s0 = initialState!
      const s1 = config(s0, { length: 'long', players: 3, country: 'ireland' })!
      const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue] })!
      expect(getPlayer(s2)).toBe(s2.players[0])
      expect(getPlayer(s2)).not.toBe(s2.players[1])
      expect(getPlayer(s2)).not.toBe(s2.players[2])
    })
    it('gets the indexed player', () => {
      expect.assertions(3)
      const s0 = initialState!
      const s1 = config(s0, { length: 'long', players: 3, country: 'ireland' })!
      const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue] })!
      expect(getPlayer(s2, 0)).toBe(s2.players[0])
      expect(getPlayer(s2, 1)).toBe(s2.players[1])
      expect(getPlayer(s2, 2)).toBe(s2.players[2])
    })
  })
  describe('setPlayer', () => {
    it('sets the active player only', () => {
      expect.assertions(4)
      const src = { ...initialState, activePlayerIndex: 2, players: [p, p, p, p] }
      const player: Tableau = { ...p, wood: 5 }
      const dst = setPlayer(src as unknown as GameStatePlaying, player)
      expect(dst?.players?.[0].wood).toBe(0)
      expect(dst?.players?.[1].wood).toBe(0)
      expect(dst?.players?.[2].wood).toBe(5)
      expect(dst?.players?.[3].wood).toBe(0)
    })
    it('sets the indexed player', () => {
      expect.assertions(4)
      const src = { ...initialState, activePlayerIndex: 2, players: [p, p, p, p] }
      const player: Tableau = { ...p, wood: 5 }
      const dst = setPlayer(src as unknown as GameStatePlaying, player, 1)
      expect(dst?.players?.[0].wood).toBe(0)
      expect(dst?.players?.[1].wood).toBe(5)
      expect(dst?.players?.[2].wood).toBe(0)
      expect(dst?.players?.[3].wood).toBe(0)
    })
  })
})
