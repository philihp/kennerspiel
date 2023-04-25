import { always, curry, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const dormitory = (param = '') => {
  const input = parseResourceParam(param)
  const iterations = Math.min((input.straw ?? 0) + (input.grain ?? 0), input.wood ?? 0)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ ceramic: 1, book: iterations })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
