import { always, concat, curry, lift, map, pipe, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { concatStr, costEnergy, energyCostOptions, parseResourceParam, resourceArray } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

export const cloisterWorkshop = (clayStoneEnergy = '') => {
  const inputs = parseResourceParam(clayStoneEnergy)
  const energy = costEnergy(inputs)
  const { clay = 0, stone = 0 } = inputs
  // this will prefer to make an ornament, when energy is short but clay/stone is abundant
  const ornament = Math.min(stone, energy, 1)
  const ceramic = Math.min(clay, 3, energy - ornament)
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ ceramic, ornament })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      return unnest(
        map(
          (inputs: string): string[] =>
            map(
              //
              concat(inputs),
              energyCostOptions(Math.floor(inputs.length / 2), player)
            ),
          lift(concatStr)(
            resourceArray(ResourceEnum.Clay, 3)(player.clay),
            resourceArray(ResourceEnum.Stone, 1)(player.stone)
          )
        )
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
