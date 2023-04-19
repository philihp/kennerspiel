import { always, curry, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const grainStorage = (param = '') => {
  const input = parseResourceParam(param)
  if (costMoney(input) < 1) return identity
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ grain: 6 })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => (view(activeLens(state), state).penny ? ['Pn', ''] : ['']))
    .with([P._], always(['']))
    .otherwise(always([]))
)
