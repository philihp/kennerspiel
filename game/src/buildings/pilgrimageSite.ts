import { always, curry, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

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
    .with([], () => {
      const { book = 0, ceramic = 0, ornament = 0 } = view(activeLens(state), state)
      return [
        ...(book ? [ResourceEnum.Book] : []),
        ...(ceramic ? [ResourceEnum.Ceramic] : []),
        ...(ornament ? [ResourceEnum.Ornament] : []),
        '',
      ]
    })
    .with([P._], ([param1]) => {
      const { book: usedBook = 0, ceramic: usedCeramic = 0, ornament: usedOrnament = 0 } = parseResourceParam(param1)
      const { book: hasBook = 0, ceramic: hasCeramic = 0, ornament: hasOrnament = 0 } = view(activeLens(state), state)
      return [
        ...(hasBook - usedBook > 0 ? [ResourceEnum.Book] : []),
        ...(hasCeramic - usedCeramic + usedBook > 0 ? [ResourceEnum.Ceramic] : []),
        ...(hasOrnament - usedOrnament + usedCeramic > 0 ? [ResourceEnum.Ornament] : []),
        '',
      ]
    })
    .with([P._, P._], always(['']))
    .otherwise(always([]))
)
