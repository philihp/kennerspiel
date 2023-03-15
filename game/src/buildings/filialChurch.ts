import { identity, pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { differentGoods, parseResourceParam } from '../board/resource'
import { StateReducer } from '../types'

export const filialChurch = (param = ''): StateReducer => {
  const inputs = parseResourceParam(param)
  if (differentGoods(inputs) < 5) return identity
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ reliquary: 1 })
    )
  )
}
