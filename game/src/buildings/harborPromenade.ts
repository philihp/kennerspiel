import { always, curry } from 'ramda'
import { match } from 'ts-pattern'
import { getCost, withActivePlayer } from '../board/player'
import { GameState } from '../types'

export const harborPromenade = () =>
  withActivePlayer(
    getCost({
      wood: 1,
      wine: 1,
      penny: 1,
      ceramic: 1,
    })
  )

export const complete = curry((partial: string[], _state: GameState): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)
