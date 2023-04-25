import { always, curry, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const refectory = (param = '') => {
  const { meat = 0 } = parseResourceParam(param)
  const iterations = Math.min(4, meat)
  return withActivePlayer(
    pipe(
      //
      getCost({ beer: 1, meat: 1 }),
      payCost({ meat: iterations }),
      getCost({ ceramic: iterations })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
