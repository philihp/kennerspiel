import { always, curry, lift, map, min, pipe, props, range, view, zip, zipWith } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, resourceArray, zip3 } from '../board/resource'
import { Cost, GameStatePlaying, ResourceEnum, Tableau } from '../types'

export const whiskeyDistillery = (input = '') => {
  const { malt = 0, wood = 0, peat = 0 } = parseResourceParam(input)
  const whiskey = 2 * Math.min(malt, wood, peat)
  return withActivePlayer(
    pipe(
      //
      payCost({ malt, wood, peat }),
      getCost({ whiskey })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const iterations = Math.min(
        ...props<keyof Cost, number>(['malt', 'wood', 'peat'], view(activeLens(state), state))
      )
      return zip3(
        resourceArray(ResourceEnum.Malt)(iterations),
        resourceArray(ResourceEnum.Wood)(iterations),
        resourceArray(ResourceEnum.Peat)(iterations)
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
