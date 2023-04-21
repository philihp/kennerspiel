import { always, curry, map, pipe, range, reverse, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying } from '../types'

export const peatCoalKiln = (param = '') => {
  const { peat = 0 } = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      getCost({ coal: 1 + peat, penny: 1 }),
      payCost({ peat })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { peat = 0 } = view(activeLens(state), state)
      return map<number, string>(stringRepeater('Pt'), reverse(range(0, 1 + peat)))
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
