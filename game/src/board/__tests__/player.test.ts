import { view } from 'ramda'
import { Clergy, GameCommandConfigParams, GameStatePlaying, PlayerColor, Tableau } from '../../types'
import {
  activeLens,
  clergyForColor,
  getCost,
  indexLens,
  isLayBrother,
  isPrior,
  payCost,
  subtractCoins,
  withActivePlayer,
} from '../player'

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
}

describe('board/player', () => {
  describe('clergyForColor', () => {
    it('gives 3 clergy for red', () => {
      const config: GameCommandConfigParams = {
        country: 'france',
        length: 'long',
        players: 3,
      }
      const clergy = clergyForColor(config)(PlayerColor.Red)
      expect(clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])
    })
    it('gives 3 clergy for 2p short', () => {
      const config: GameCommandConfigParams = {
        country: 'france',
        length: 'short',
        players: 2,
      }
      const clergy = clergyForColor(config)(PlayerColor.Blue)
      expect(clergy).toStrictEqual(['LB1B', 'LB2B', 'PRIB'])
    })
    it('removes a laybrother for short 3p', () => {
      const config: GameCommandConfigParams = {
        country: 'france',
        length: 'short',
        players: 3,
      }
      const clergy = clergyForColor(config)(PlayerColor.Red)
      expect(clergy).toStrictEqual(['LB1R', 'PRIR'])
    })
    it('removes a laybrother for short 4p', () => {
      const config: GameCommandConfigParams = {
        country: 'ireland',
        length: 'short',
        players: 4,
      }
      const clergy = clergyForColor(config)(PlayerColor.White)
      expect(clergy).toStrictEqual(['LB1W', 'PRIW'])
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
      malt: 0,
      coal: 0,
      book: 0,
      ceramic: 0,
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
    it('pays out from nickels if not enough pennies', () => {
      const p0 = {
        ...player,
        penny: 0,
        nickel: 2,
        wine: 0,
        whiskey: 0,
      }
      const p1 = payCost({ penny: 8 })(p0)
      expect(p1).toMatchObject({
        penny: 2,
        nickel: 0,
      })
    })
    it('pays out from wine if not enough pennies', () => {
      const p0 = {
        ...player,
        penny: 1,
        nickel: 0,
        wine: 4,
        whiskey: 0,
      }
      const p1 = payCost({ penny: 3 })(p0)
      expect(p1).toMatchObject({
        penny: 0,
        wine: 2,
      })
    })
    it('pays out from whiskey if not enough pennies', () => {
      const p0 = {
        ...player,
        penny: 3,
        nickel: 0,
        wine: 0,
        whiskey: 2,
      }
      const p1 = payCost({ penny: 4 })(p0)
      expect(p1).toMatchObject({
        penny: 1,
        whiskey: 1,
      })
    })
    it('prefers nickels over whiskey', () => {
      const p0 = {
        ...player,
        penny: 1,
        nickel: 1,
        whiskey: 7,
      }
      const p1 = payCost({ penny: 7 })(p0)
      expect(p1).toMatchObject({
        penny: 1,
        nickel: 0,
        whiskey: 6,
      })
    })
    it('prefers nickels over wine', () => {
      const p0 = {
        ...player,
        penny: 1,
        nickel: 1,
        wine: 7,
      }
      const p1 = payCost({ penny: 8 })(p0)
      expect(p1).toMatchObject({
        penny: 0,
        nickel: 0,
        wine: 5,
      })
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
      malt: 0,
      coal: 0,
      book: 0,
      ceramic: 0,
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

  describe('withActivePlayer', () => {
    const p0 = {
      ...p,
      color: PlayerColor.Red,
    } as Tableau
    const p1 = {
      ...p,
      color: PlayerColor.Green,
    } as Tableau
    const p2 = {
      ...p,
      color: PlayerColor.White,
    } as Tableau
    const s0 = {
      players: [p0, p1, p2],
      frame: {
        activePlayerIndex: 1,
      },
    } as GameStatePlaying

    it('will read from activePlayer', () => {
      const fn = jest.fn()
      withActivePlayer(fn)(s0)
      expect(fn).toHaveBeenCalledWith(p1)
    })
    it('returns undefined if player returns undefined', () => {
      const s1 = withActivePlayer(() => undefined)(s0)
      expect(s1).toBeUndefined()
    })
    it('mutates the player in question', () => {
      const s1 = withActivePlayer((player) => ({
        ...player,
        sheep: 5,
      }))(s0)
      expect(s1?.players?.[1]).toMatchObject({
        sheep: 5,
      })
    })
    it('does nothing if nothing changed', () => {
      const fn = jest.fn()
      const s1 = withActivePlayer((player) => {
        fn(player)
        return player
      })(s0)
      expect(s0).toBe(s1)
      expect(fn).toHaveBeenCalledWith(p1)
    })
  })

  describe('activeLens', () => {
    const s0 = {
      players: [
        {
          ...p,
          color: PlayerColor.Red,
        },
        {
          ...p,
          color: PlayerColor.Green,
        },
        {
          ...p,
          color: PlayerColor.White,
        },
      ],
      frame: {
        activePlayerIndex: 1,
      },
    } as GameStatePlaying
    it('can work on a state', () => {
      const p1 = view(activeLens(s0), s0)
      expect(p1?.color).toBe('G')
    })
    it('is fine on an undefined state', () => {
      const p1 = view(activeLens(undefined), undefined)
      expect(p1).toBeUndefined()
    })
    it('returns undefined if no active player in frame', () => {
      const s1 = {
        ...s0,
        frame: {},
      } as GameStatePlaying

      const p1 = view(activeLens(s1), s1)
      expect(p1?.color).toBeUndefined()
    })
    it('returns undefined if active player does not exist', () => {
      const s1 = {
        ...s0,
        frame: {
          activePlayerIndex: 4,
        },
      } as GameStatePlaying

      const p1 = view(activeLens(s1), s1)
      expect(p1?.color).toBeUndefined()
    })
  })

  describe('indexLens', () => {
    const s0 = {
      players: [
        {
          ...p,
          color: PlayerColor.Red,
        },
        {
          ...p,
          color: PlayerColor.Green,
        },
        {
          ...p,
          color: PlayerColor.White,
        },
      ],
      frame: {
        activePlayerIndex: 1,
      },
    } as GameStatePlaying
    it('gives the second player', () => {
      const p1 = view(indexLens(2), s0)
      expect(p1?.color).toBe('W')
    })
    it('gives undefined if player doesnt exist', () => {
      const p1 = view(indexLens(42), undefined)
      expect(p1).toBeUndefined()
    })
  })
})
