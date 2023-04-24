import { always, curry, map, pipe, range, reverse, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

export const cloisterChurch = (param = '') => {
  const inputs = parseResourceParam(param)
  const reliquary = Math.min(2, inputs.bread ?? 0, inputs.wine ?? 2)
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ reliquary })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { bread = 0, wine = 0 } = view(activeLens(state), state)
      return map(
        (n) => `${stringRepeater(ResourceEnum.Bread, n)}${stringRepeater(ResourceEnum.Wine, n)}`,
        reverse<number>(range(0, 1 + Math.min(bread, wine, 2)))
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
