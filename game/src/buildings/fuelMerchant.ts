import { always, append, curry, flip, map, pipe, reverse, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, payCost, withActivePlayer } from '../board/player'
import { canAfford, costEnergy, energyCostOptions, parseResourceParam } from '../board/resource'
import { Cost, GameStatePlaying, Tableau } from '../types'

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

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      return unnest(
        map(
          // TODO: id like to flip energyCostOptions and then curry out the n, but it doesnt seem to work...
          (n) => energyCostOptions(n, view(activeLens(state), state)),
          // flip<number, Cost, string>(energyCostOptions)(view(activeLens(state), state)),
          [9, 6, 3, 0]
        )
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
