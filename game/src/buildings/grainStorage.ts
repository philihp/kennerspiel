import { identity, pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'

export const grainStorage = (param = '') => {
  const input = parseResourceParam(param)
  if (costMoney(input) < 1) return identity
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ grain: 6 })
    )
  )
}
