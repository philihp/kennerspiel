import { always, curry, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying, StateReducer } from '../types'

export const coalHarbor = (param = ''): StateReducer => {
  const { peat = 0 } = parseResourceParam(param)
  const iterations = Math.min(3, peat)
  return withActivePlayer(
    pipe(
      //
      payCost({ peat: iterations }),
      getCost({
        whiskey: iterations,
        penny: (3 * iterations) % 5,
        nickel: Math.floor((3 * iterations) / 5),
      })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
