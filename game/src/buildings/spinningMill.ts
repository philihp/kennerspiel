import { T, __, always, cond, curry, gte } from 'ramda'
import { match } from 'ts-pattern'
import { getCost, withActivePlayer } from '../board/player'
import { GameStatePlaying, StateReducer } from '../types'

export const spinningMill = (): StateReducer => {
  return withActivePlayer((player) => {
    // TODO: this could be an evolve?
    return getCost({
      penny: cond([
        [gte(__, 9), always(6)],
        [gte(__, 5), always(5)],
        [gte(__, 1), always(3)],
        [T, always(0)],
      ])(player.sheep ?? 0),
    })(player)
  })
}

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)
