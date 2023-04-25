import { always, curry, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const pilgrimageSite = (param1 = '', param2 = '') => {
  const { book: book1 = 0, ceramic: ceramic1 = 0, ornament: ornament1 = 0 } = parseResourceParam(param1)
  const { book: book2 = 0, ceramic: ceramic2 = 0, ornament: ornament2 = 0 } = parseResourceParam(param2)
  if (book1 + ceramic1 + ornament1 > 1) return () => undefined
  if (book2 + ceramic2 + ornament2 > 1) return () => undefined
  return withActivePlayer(
    pipe(
      payCost({ book: book1, ceramic: ceramic1, ornament: ornament1 }),
      getCost({ ceramic: book1, ornament: ceramic1, reliquary: ornament1 }),
      payCost({ book: book2, ceramic: ceramic2, ornament: ornament2 }),
      getCost({ ceramic: book2, ornament: ceramic2, reliquary: ornament2 })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
