import { always, curry, map, min, range, reverse, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, withActivePlayer } from '../board/player'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'

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
    .with([], () => {
      const { grain = 0 } = view(activeLens(state), state)
      return map<number, string>(stringRepeater(ResourceEnum.Grain), reverse(range(0, 1 + min(7, grain))))
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
