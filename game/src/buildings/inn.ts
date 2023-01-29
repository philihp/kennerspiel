import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costFood, parseResourceParam } from '../board/resource'

export const inn = (param = '') => {
  const inputs = parseResourceParam(param)
  const hasWine = (inputs.wine ?? 0) >= 1
  const food = Math.min(costFood(inputs) - (hasWine ? 1 : 0), 7)
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({
        nickel: hasWine ? 1 : 0,
        penny: (hasWine ? 1 : 0) + food,
      })
    )
  )
}
