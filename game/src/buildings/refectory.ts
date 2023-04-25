import { always, curry, map, min, pipe, range, reverse, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

export const refectory = (param = '') => {
  const { meat = 0 } = parseResourceParam(param)
  const iterations = Math.min(4, meat)
  return withActivePlayer(
    pipe(
      //
      getCost({ beer: 1, meat: 1 }),
      payCost({ meat: iterations }),
      getCost({ ceramic: iterations })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { meat = 0 } = view(activeLens(state), state)
      return map<number, string>(stringRepeater(ResourceEnum.Meat), reverse(range(0, 2 + min(3, meat))))
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
