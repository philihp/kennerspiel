import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const pilgrimageSite = (param = '') => {
  const { book = 0, pottery = 0, ornament = 0 } = parseResourceParam(param)
  const iterations = Math.min(2, book, pottery, ornament)
  return withActivePlayer(
    pipe(
      payCost({ book, pottery, ornament }),
      getCost({ pottery: iterations, ornament: iterations, reliquary: iterations })
    )
  )
}
