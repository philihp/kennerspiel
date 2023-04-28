import { curry, pipe } from 'ramda'
import { match } from 'ts-pattern'
import { subtractCoins, withActivePlayer } from '../board/player'
import { GameCommandConvertParams, GameCommandEnum, GameStatePlaying, Tableau } from '../types'

const convertGrain =
  (amount = 0) =>
  (player: Tableau | undefined) =>
    player && {
      ...player,
      grain: (player.grain ?? 0) - amount,
      straw: (player.straw ?? 0) + amount,
    }

const convertWine =
  (amount = 0) =>
  (player: Tableau | undefined) =>
    player && {
      ...player,
      wine: (player.wine ?? 0) - amount,
      penny: (player.penny ?? 0) + amount,
    }

const convertNickel =
  (amount = 0) =>
  (player: Tableau | undefined) =>
    player && {
      ...player,
      nickel: (player.nickel ?? 0) - amount,
      penny: (player.penny ?? 0) + amount * 5,
    }

const convertWhiskey =
  (amount = 0) =>
  (player: Tableau | undefined) =>
    player && {
      ...player,
      whiskey: (player.whiskey ?? 0) - amount,
      penny: (player.penny ?? 0) + amount * 2,
    }

const convertPenny =
  (amount = 0) =>
  (player: Tableau | undefined) => {
    const subtracted = subtractCoins(amount)(player)
    if (subtracted === undefined) return undefined
    const p = { ...subtracted }
    // janice, then do the thing
    p.nickel += amount / 5
    p.penny += amount % 5
    return p
  }

export const convert = ({ grain, wine, nickel, whiskey, penny }: GameCommandConvertParams) => {
  if ((penny ?? 0) % 5 !== 0) return () => undefined
  return withActivePlayer(
    pipe(
      //
      convertGrain(grain),
      convertWine(wine),
      convertNickel(nickel),
      convertWhiskey(whiskey),
      convertPenny(penny)
    )
  )
}

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] =>
    match<string[], string[]>(partial)
      .with([], () => {
        if (
          withActivePlayer((player) => {
            if (!player) return player
            const { penny, grain, wine, nickel, whiskey } = player
            if (penny >= 5 || grain || wine || nickel || whiskey) return player
            return undefined
          })(state)
        ) {
          return [GameCommandEnum.CONVERT]
        }
        return []
      })
      .with([GameCommandEnum.CONVERT], () => {
        return []
      })
      .otherwise(() => [])
