import { pipe } from 'ramda'
import { getPlayer, setPlayer, subtractCoins } from '../board/player'
import { GameCommandConvertParams, GameStatePlaying, Tile, BuildingEnum, Tableau } from '../types'

const convertGrain =
  (amount = 0) =>
  (player: Tableau) => ({
    ...player,
    grain: (player.grain ?? 0) - amount,
    straw: (player.straw ?? 0) + amount,
  })

const convertWine =
  (amount = 0) =>
  (player: Tableau) => ({
    ...player,
    wine: (player.wine ?? 0) - amount,
    penny: (player.penny ?? 0) + amount,
  })

const convertNickel =
  (amount = 0) =>
  (player: Tableau) => ({
    ...player,
    nickel: (player.nickel ?? 0) - amount,
    penny: (player.penny ?? 0) + amount * 5,
  })

const convertWhiskey =
  (amount = 0) =>
  (player: Tableau) => ({
    ...player,
    whiskey: (player.whiskey ?? 0) - amount,
    penny: (player.penny ?? 0) + amount * 2,
  })

const convertPenny =
  (amount = 0) =>
  (player: Tableau) => {
    const p = { ...subtractCoins(amount)(player) }
    // then do the thing
    p.nickel += amount / 5
    p.penny += amount % 5
    return p
  }

export const convert =
  (param: GameCommandConvertParams) =>
  (state: GameStatePlaying): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    if ((param.penny ?? 0) % 5 !== 0) {
      return undefined
    }

    const out = setPlayer(
      state,
      pipe(
        getPlayer,
        convertGrain(param.grain),
        convertWine(param.wine),
        convertNickel(param.nickel),
        convertWhiskey(param.whiskey),
        convertPenny(param.penny)
      )(state)
    )

    return out
  }
