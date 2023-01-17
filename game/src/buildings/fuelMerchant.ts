import { pipe } from 'ramda'
import { getPlayer, payCost, setPlayer, setPlayerCurried } from '../board/player'
import { canAfford, costEnergy, parseResourceParam } from '../board/resource'
import { GameStatePlaying, Tableau } from '../types'

const addProceeds =
  (energy: number) =>
  (player: Tableau | undefined): Tableau | undefined => {
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

export const fuelMerchant =
  (param = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const inputs = parseResourceParam(param)
    const energy = costEnergy(inputs)
    const oldPlayer = getPlayer(state)
    if (!canAfford(inputs)(oldPlayer)) return undefined
    if (oldPlayer === undefined) return undefined

    const newPlayer = pipe(
      // everything is a nail
      payCost(inputs),
      addProceeds(energy)
    )(oldPlayer)

    return setPlayerCurried(newPlayer)(state)
  }
