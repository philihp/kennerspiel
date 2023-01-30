import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costEnergy, costFood, parseResourceParam } from '../board/resource'

export const estate = (param = '') => {
  const input = parseResourceParam(param)
  const iterations = Math.min(Math.floor(costEnergy(input) / 6) + Math.floor(costFood(input) / 10), 2)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ book: iterations, ornament: iterations })
    )
  )
}
