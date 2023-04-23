import { always, curry, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const shipyard = (param = '') => {
  const iterations = (parseResourceParam(param).wood ?? 0) / 2
  return withActivePlayer(
    pipe(
      //
      payCost({ wood: iterations * 2 }),
      getCost({ ornament: iterations, nickel: iterations })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { wood = 0 } = view(activeLens(state), state)
      if (wood >= 2) return ['WoWo', '']
      return ['']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
