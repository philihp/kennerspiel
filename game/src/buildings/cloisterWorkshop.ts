import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costEnergy, parseResourceParam } from '../board/resource'
import { Tableau } from '../types'

const checkEnoughEnergy =
  ({ clay = 0, stone = 0 }, energy: number) =>
  (player: Tableau | undefined) => {
    if (clay + stone > energy) return undefined
    return player
  }

export const cloisterWorkshop = (clayStoneEnergy = '') => {
  const inputs = parseResourceParam(clayStoneEnergy)
  const energy = costEnergy(inputs)
  const clay = Math.min(inputs.clay ?? 0, 3)
  const stone = Math.min(inputs.stone ?? 0, 1)
  return withActivePlayer(
    pipe(
      //
      checkEnoughEnergy({ clay, stone }, energy),
      payCost(inputs),
      getCost({ pottery: clay, ornament: stone })
    )
  )
}
