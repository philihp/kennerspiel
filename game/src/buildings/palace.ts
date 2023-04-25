import { always, curry, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { allOccupiedBuildingsUsable } from '../board/frame'
import { activeLens, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const palace = (input = '') => {
  const { wine = 0 } = parseResourceParam(input)
  if (wine === 0) return identity
  return pipe(
    //
    withActivePlayer(payCost({ wine })),
    allOccupiedBuildingsUsable
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { wine = 0 } = view(activeLens(state), state)
      if (wine) return ['Wn', '']
      return ['']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
