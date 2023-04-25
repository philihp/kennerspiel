import { always, curry, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { allOccupiedBuildingsUsable } from '../board/frame'
import { activeLens, payCost, withActivePlayer } from '../board/player'
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
    .with([], () => {
      const { whiskey = 0 } = view(activeLens(state), state)
      if (whiskey) return ['Wh', '']
      return ['']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
