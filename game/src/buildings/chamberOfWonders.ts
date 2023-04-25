import { always, curry, pipe, reduce, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getWonder, payCost, withActivePlayer } from '../board/player'
import { allResource, combinations, differentGoods, parseResourceParam } from '../board/resource'
import { removeWonder } from '../board/state'
import { Cost, GameStatePlaying, Tableau } from '../types'

const check13DifferentGoods =
  (input: Cost) =>
  (player: Tableau | undefined): Tableau | undefined => {
    const count = differentGoods(input)
    if (count !== 13) return undefined
    return player
  }

export const chamberOfWonders =
  (param = '') =>
  (state?: GameStatePlaying): GameStatePlaying | undefined => {
    const inputs = parseResourceParam(param)
    return pipe(
      withActivePlayer(
        pipe(
          //
          check13DifferentGoods(inputs),
          payCost(inputs),
          getWonder()
        )
      ),
      removeWonder
    )(state)
  }

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match<string[], string[]>(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      return [
        ...combinations(
          13,
          reduce(
            (accum, [key, token]) => {
              if (player[key]) accum.push(token)
              return accum
            },
            [] as string[],
            allResource
          )
        ),
        '',
      ]
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
