import { always, curry, identity, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { allOccupiedBuildingsUsable } from '../board/frame'
import { payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const grandManor = (input = '') => {
  const { whiskey = 0 } = parseResourceParam(input)
  if (whiskey === 0) return identity
  return pipe(
    //
    withActivePlayer(payCost({ whiskey })),
    allOccupiedBuildingsUsable
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
