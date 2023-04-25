import { always, curry, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const townEstate = (param = '') => {
  const { ceramic = 0 } = parseResourceParam(param)
  if (ceramic === 0) return identity
  return withActivePlayer(
    pipe(
      //
      payCost({ ceramic }),
      getCost({ nickel: 2, penny: 2 })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { ceramic = 0 } = view(activeLens(state), state)
      if (ceramic) return ['Ce', '']
      return ['']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
