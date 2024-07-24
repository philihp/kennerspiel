import { join, map, pipe, reduce, reject, split } from 'ramda'
import { GameState, initialState, reducer } from '.'

export const spiel = pipe(
  join(''),
  split('\n'),
  map((s) => s.trim()),
  reject((s) => s === ''),
  map((s: string) => s.split(' ')),
  reduce((state: GameState | undefined, command: string[]) => reducer(state!, command), initialState)
)
