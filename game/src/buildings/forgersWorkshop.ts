import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'

export const forgersWorkshop = (param = '') => {
  const input = parseResourceParam(param)
  const coins = costMoney(input)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ reliquary: coins >= 5 ? 1 : 0 }),
      getCost({ reliquary: Math.floor((coins - 5) / 10) })
    )
  )
}
