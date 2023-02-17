import { Clergy, PlayerColor, Tableau } from '../../types'
import { getCost, isLayBrother, isPrior, payCost, subtractCoins } from '../player'

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
    it('if cost is passed in with undefined, ignore it', () => {
      expect(payCost({ straw: undefined })(player)).toMatchObject({
        clay: 4,
        wood: 2,
        straw: 6,
      })
    })

    it('fails if player cant pay', () => {
      expect(player).toMatchObject({
        clay: 4,
      })
      expect(payCost({ clay: 5 })(player)).toBeUndefined()
    })
  })

  describe('getCost', () => {
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

    it('adds to the existing amount', () => {
      expect(player).toMatchObject({
        clay: 4,
      })
      expect(getCost({ clay: 3 })(player)).toMatchObject({
        clay: 7,
      })
    })
    it('accepts multiple things as cost', () => {
      expect(player).toMatchObject({
        clay: 4,
        wood: 2,
      })
      expect(getCost({ clay: 3, wood: 2 })(player)).toMatchObject({
        clay: 7,
        wood: 4,
      })
    })
    it('if a cost is passed in with undefined, ignore it', () => {
      expect(getCost({ wood: 1, straw: undefined, clay: 1 })(player)).toMatchObject({
        clay: 5,
        wood: 3,
        straw: 6,
      })
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
