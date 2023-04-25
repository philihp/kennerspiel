import { always, curry, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getWonder, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { removeWonder } from '../board/state'
import { GameStatePlaying } from '../types'

export const sacristy = (param = '') => {
  const input = parseResourceParam(param)
  const iterations = Math.min(
    1,
    Math.max(
      //
      input.book ?? 0,
      input.ceramic ?? 0,
      input.ornament ?? 0,
      input.reliquary ?? 0
    )
  )
  return pipe(
    withActivePlayer(
      pipe(
        //
        payCost(input),
        getWonder(iterations)
      )
    ),
    removeWonder
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
