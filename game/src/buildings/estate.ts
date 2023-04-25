import { always, curry, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costEnergy, costFood, parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const estate = (param = '') => {
  const input = parseResourceParam(param)
  const iterations = Math.min(Math.floor(costEnergy(input) / 6) + Math.floor(costFood(input) / 10), 2)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ book: iterations, ornament: iterations })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
