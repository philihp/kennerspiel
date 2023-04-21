import { always, curry } from 'ramda'
import { match } from 'ts-pattern'
import { getCost, withActivePlayer } from '../board/player'
import { GameStatePlaying } from '../types'

export const cloisterChapterHouse = () =>
  withActivePlayer(getCost({ clay: 1, wood: 1, peat: 1, sheep: 1, grain: 1, penny: 1 }))

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)
