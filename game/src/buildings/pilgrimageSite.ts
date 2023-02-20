import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const pilgrimageSite = (param1 = '', param2 = '') => {
  const { book: book1 = 0, pottery: pottery1 = 0, ornament: ornament1 = 0 } = parseResourceParam(param1)
  const { book: book2 = 0, pottery: pottery2 = 0, ornament: ornament2 = 0 } = parseResourceParam(param2)
  if (book1 + pottery1 + ornament1 > 1) return () => undefined
  if (book2 + pottery2 + ornament2 > 1) return () => undefined
  return withActivePlayer(
    pipe(
      payCost({ book: book1, pottery: pottery1, ornament: ornament1 }),
      getCost({ pottery: book1, ornament: pottery1, reliquary: ornament1 }),
      payCost({ book: book2, pottery: pottery2, ornament: ornament2 }),
      getCost({ pottery: book2, ornament: pottery2, reliquary: ornament2 })
    )
  )
}
