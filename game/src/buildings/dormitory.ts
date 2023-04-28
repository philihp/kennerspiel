import { always, curry, map, min, pipe, range, reverse, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

export const dormitory = (param = '') => {
  const input = parseResourceParam(param)
  const iterations = Math.min((input.straw ?? 0) + (input.grain ?? 0), input.wood ?? 0)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ ceramic: 1, book: iterations })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { wood = 0, straw = 0 } = view(activeLens(state), state)
      return map(
        (n) => `${stringRepeater(ResourceEnum.Wood, n)}${stringRepeater(ResourceEnum.Straw, n)}`,
        reverse(range(0, 1 + min(wood, straw)))
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
