import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { StateReducer } from '../types'

export const malthouse = (param = ''): StateReducer => {
  const { grain = 0 } = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      payCost({ grain }),
      getCost({
        malt: grain,
        straw: grain,
      })
    )
  )
}
