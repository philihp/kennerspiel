import { always, curry } from 'ramda'
import { match } from 'ts-pattern'
import { setFrameToAllowFreeUsage } from '../board/frame'
import { GameStatePlaying, StateReducer } from '../types'

export const guesthouse = (): StateReducer => (state) => state && setFrameToAllowFreeUsage(state.buildings)(state)

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)
