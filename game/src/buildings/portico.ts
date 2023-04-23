import { always, curry, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const portico = (param = '') => {
  const { reliquary = 0 } = parseResourceParam(param)
  if (reliquary < 1) return identity
  return withActivePlayer(
    pipe(
      payCost({ reliquary }),
      getCost({
        stone: 2,
        clay: 2,
        wood: 2,
        peat: 2,
        penny: 2,
        grain: 2,
        sheep: 2,
      })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      if (view(activeLens(state), state).reliquary) return ['Rq', '']
      return ['']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
