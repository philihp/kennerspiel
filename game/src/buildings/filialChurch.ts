import { always, curry, identity, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { differentGoods, parseResourceParam } from '../board/resource'
import { GameStatePlaying, StateReducer } from '../types'

export const filialChurch = (param = ''): StateReducer => {
  const inputs = parseResourceParam(param)
  if (differentGoods(inputs) < 5) return identity
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ reliquary: 1 })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
