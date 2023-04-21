import { always, curry, xor } from 'ramda'
import { match } from 'ts-pattern'
import { getCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying, StateReducer } from '../types'

export const falseLighthouse = (param = ''): StateReducer => {
  const { whiskey = 0, beer = 0 } = parseResourceParam(param)
  if (!xor(whiskey === 1, beer === 1)) return () => undefined
  return withActivePlayer(
    getCost({
      penny: 3,
      whiskey,
      beer,
    })
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)
