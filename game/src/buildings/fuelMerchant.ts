import { pipe } from 'ramda'
import { payCost, withActivePlayer } from '../board/player'
import { canAfford, costEnergy, parseResourceParam } from '../board/resource'
import { Cost, Tableau } from '../types'

const addProceeds = (fuel: Cost) => {
  const energy = costEnergy(fuel)
  return (player: Tableau | undefined): Tableau | undefined => {
    if (player === undefined) return undefined
    if (energy >= 9) {
      return {
        ...player,
        nickel: player.nickel + 2,
      }
    }
    if (energy >= 6) {
      return {
        ...player,
        nickel: player.nickel + 1,
        penny: player.penny + 3,
      }
    }
    if (energy >= 3) {
      return {
        ...player,
        nickel: player.nickel + 1,
      }
    }
    return player
  }
}

export const fuelMerchant = (param = '') => {
  const inputs = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      (p) => (canAfford(inputs)(p) ? p : undefined),
      payCost(inputs),
      addProceeds(inputs)
    )
  )
}
