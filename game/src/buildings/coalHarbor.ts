import { always, curry, map, min, pipe, range, reverse, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'

export const coalHarbor = (param = ''): StateReducer => {
  const { peat = 0 } = parseResourceParam(param)
  const iterations = Math.min(3, peat)
  return withActivePlayer(
    pipe(
      //
      payCost({ peat: iterations }),
      getCost({
        whiskey: iterations,
        penny: (3 * iterations) % 5,
        nickel: Math.floor((3 * iterations) / 5),
      })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { coal = 0 } = view(activeLens(state), state)
      return map<number, string>(stringRepeater(ResourceEnum.Coal), reverse(range(0, 1 + min(3, coal))))
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
