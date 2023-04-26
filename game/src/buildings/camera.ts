import { always, curry, identity, map, min, pipe, range, reverse, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'

export const camera = (param = ''): StateReducer => {
  const { book = 0, ceramic = 0 } = parseResourceParam(param)
  const iterations = Math.min(2, book, ceramic)
  if (!iterations) return identity
  return withActivePlayer(
    pipe(
      //
      payCost({ book: iterations, ceramic: iterations }),
      getCost({ penny: iterations, clay: iterations, reliquary: iterations })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { book = 0, ceramic = 0 } = view(activeLens(state), state)
      return map(
        (iterations) =>
          `${stringRepeater(ResourceEnum.Straw, iterations)}${stringRepeater(ResourceEnum.Wood, iterations)}`,
        reverse(range(0, 1 + Math.min(book, ceramic, 2)))
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
