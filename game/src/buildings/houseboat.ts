import { match } from 'ts-pattern'
import { always, curry } from 'ramda'
import { getCost, withActivePlayer } from '../board/player'
import { GameStatePlaying, StateReducer } from '../types'

export const houseboat = (): StateReducer => {
  return withActivePlayer(
    getCost({
      wood: 1,
      malt: 1,
      penny: 1,
      peat: 1,
    })
  )
}

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)
