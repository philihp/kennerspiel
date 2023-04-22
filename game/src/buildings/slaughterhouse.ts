import { always, ap, curry, lift, map, min, pipe, range, reverse, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

export const slaughterhouse = (param = '') => {
  const inputs = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ meat: Math.min(inputs.sheep ?? 0, inputs.straw ?? 0) })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { sheep = 0, straw = 0 } = view(activeLens(state), state)
      return map(
        (n) => `${stringRepeater(ResourceEnum.Sheep, n)}${stringRepeater(ResourceEnum.Straw, n)}`,
        reverse(range(0, 1 + min(sheep, straw)))
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
