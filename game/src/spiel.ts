import { GameState, initialState, reducer } from '.'

export const spiel = (strings: TemplateStringsArray): GameState | undefined =>
  strings
    .join('')
    .split('\n')
    .slice(1)
    .map((s) => s.split(' '))
    .reduce((state: GameState | undefined, command: string[]) => reducer(state!, command), initialState)
