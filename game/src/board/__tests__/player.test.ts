import { config } from '../../commands/config'
import { start } from '../../commands/start'
import { initialState } from '../../state'
import { Clergy, GameStatePlaying, PlayerColor, Tableau } from '../../types'
import { getPlayer, isLayBrother, isPrior, payCost, setPlayer, subtractCoins } from '../player'

const p: Tableau = {
  color: PlayerColor.Red,
  clergy: [],
  landscape: [[]],
  landscapeOffset: 0,
  settlements: [],
  wonders: 0,
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
      const src = { ...initialState, frame: { activePlayerIndex: 2 }, players: [p, p, p, p] }
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

  describe('isPrior', () => {
    it('thinks priors are priors', () => {
      expect(isPrior(Clergy.PriorW)).toBeTruthy()
    })
    it('thinks lay brothers arent priors', () => {
      expect(isPrior(Clergy.LayBrother1R)).toBeFalsy()
      expect(isPrior(Clergy.LayBrother2R)).toBeFalsy()
    })
    it('does not think undefined is a prior', () => {
      expect(isPrior(undefined)).toBeFalsy()
    })
  })
  describe('isLayBrother', () => {
    it('thinks priors are priors', () => {
      expect(isLayBrother(Clergy.PriorW)).toBeFalsy()
    })
    it('thinks lay brothers arent priors', () => {
      expect(isLayBrother(Clergy.LayBrother1R)).toBeTruthy()
      expect(isLayBrother(Clergy.LayBrother2R)).toBeTruthy()
    })
    it('does not think undefined is a prior', () => {
      expect(isLayBrother(undefined)).toBeFalsy()
    })
  })

  describe('payCost', () => {
    const player: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [[]],
      wonders: 0,
      landscapeOffset: 0,
      peat: 0,
      penny: 0,
      clay: 4,
      wood: 2,
      grain: 3,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 4,
      hops: 0,
      coal: 0,
      book: 0,
      pottery: 0,
      whiskey: 0,
      straw: 6,
      meat: 0,
      ornament: 0,
      bread: 1,
      wine: 0,
      beer: 0,
      reliquary: 0,
    }

    it('can pay a cost', () => {
      expect(player).toMatchObject({
        clay: 4,
      })
      expect(payCost({ clay: 3 })(player)).toMatchObject({
        clay: 1,
      })
    })
    it('accepts multiple things as cost', () => {
      expect(player).toMatchObject({
        clay: 4,
        wood: 2,
      })
      expect(payCost({ clay: 3, wood: 2 })(player)).toMatchObject({
        clay: 1,
        wood: 0,
      })
    })

    it('fails if player cant pay', () => {
      expect(player).toMatchObject({
        clay: 4,
      })
      expect(payCost({ clay: 5 })(player)).toBeUndefined()
    })
  })

  describe('subtractCoin', () => {
    const p0: Tableau = {
      color: PlayerColor.Red,
      clergy: [],
      settlements: [],
      landscape: [[]],
      wonders: 0,
      landscapeOffset: 0,
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

    it('supports undefined player', () => {
      expect(subtractCoins(3)(undefined)).toBeUndefined()
    })
    it('subtracts coins from pennies', () => {
      expect(
        subtractCoins(3)({
          ...p0,
          penny: 4,
        })
      ).toMatchObject({
        penny: 1,
      })
    })
    it('subtracts from nickel when pennies runs dry', () => {
      expect(
        subtractCoins(3)({
          ...p0,
          penny: 2,
          nickel: 3,
        })
      ).toMatchObject({
        nickel: 2,
        penny: 4,
      })
    })
    it('subtracts from whiskey when penny and nickel run dry', () => {
      expect(
        subtractCoins(3)({
          ...p0,
          penny: 2,
          whiskey: 4,
        })
      ).toMatchObject({
        penny: 1,
        whiskey: 3,
      })
    })
    it('prefers nickel over whiskey', () => {
      expect(
        subtractCoins(1)({
          ...p0,
          nickel: 1,
          whiskey: 1,
        })
      ).toMatchObject({
        penny: 4,
        whiskey: 1,
      })
    })
    it('subtracts from wine when penny and nickel run dry', () => {
      expect(
        subtractCoins(3)({
          ...p0,
          penny: 2,
          wine: 4,
        })
      ).toMatchObject({
        penny: 0,
        wine: 3,
      })
    })
    it('prefers nickel over wine', () => {
      expect(
        subtractCoins(1)({
          ...p0,
          nickel: 1,
          wine: 1,
        })
      ).toMatchObject({
        penny: 4,
        wine: 1,
      })
    })
  })
})
