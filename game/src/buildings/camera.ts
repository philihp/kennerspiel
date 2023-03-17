import { identity, pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { StateReducer } from '../types'

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
