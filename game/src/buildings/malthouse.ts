import { always, curry, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying, StateReducer } from '../types'

export const malthouse = (param = ''): StateReducer => {
  const { grain = 0 } = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      payCost({ grain }),
      getCost({
        malt: grain,
        straw: grain,
      })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => (view(activeLens(state), state).grain ? ['Gn', ''] : ['']))
    .with([P._], always(['']))
    .otherwise(always([]))
)
