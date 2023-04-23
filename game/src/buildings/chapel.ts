import { always, concat, curry, lift, min, pipe, unnest, view, zip, zipWith } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, resourceArray } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

export const chapel = (param = '') => {
  const { penny = 0, whiskey = 0, beer = 0 } = parseResourceParam(param)
  const book = Math.min(1, penny)
  const reliquary = Math.min(3, whiskey, beer)
  return withActivePlayer(
    pipe(
      //
      payCost({ penny, whiskey, beer }),
      getCost({ book, reliquary })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { beer = 0, whiskey = 0, penny = 0 } = view(activeLens(state), state)
      const rqIter = min(beer, whiskey)
      return lift((a: string, b: string) => a + b)(
        zipWith(
          (a, b) => concat(a, b),
          resourceArray(ResourceEnum.Beer, 3)(rqIter),
          resourceArray(ResourceEnum.Whiskey, 3)(rqIter)
        ),
        resourceArray(ResourceEnum.Penny, 1)(penny)
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
