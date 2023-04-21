import { always, curry, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying, StateReducer } from '../types'

export const windmill = (param = ''): StateReducer => {
  const { grain = 0 } = parseResourceParam(param)
  const iterations = Math.min(grain, 7)
  return (state) =>
    state &&
    withActivePlayer((player) => ({
      ...player,
      grain: player.grain - iterations,
      flour: player.flour + iterations,
      straw: player.straw + iterations,
    }))(state)
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => (view(activeLens(state), state).grain ? ['Gn', ''] : ['']))
    .with([P._], always(['']))
    .otherwise(always([]))
)
