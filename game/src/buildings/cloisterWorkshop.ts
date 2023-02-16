import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costEnergy, parseResourceParam } from '../board/resource'
import { Tableau } from '../types'

export const cloisterWorkshop = (clayStoneEnergy = '') => {
  const inputs = parseResourceParam(clayStoneEnergy)
  const energy = costEnergy(inputs)
  const { clay = 0, stone = 0 } = inputs
  // this will prefer to make an ornament, when energy is short but clay/stone is abundant
  const ornament = Math.min(stone, energy, 1)
  const pottery = Math.min(clay, 3, energy - ornament)
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ pottery, ornament })
    )
  )
}
