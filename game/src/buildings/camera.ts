import { always, curry, identity, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying, StateReducer } from '../types'

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
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
