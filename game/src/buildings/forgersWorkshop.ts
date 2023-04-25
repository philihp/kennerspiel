import { always, curry, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const forgersWorkshop = (param = '') => {
  const input = parseResourceParam(param)
  const coins = costMoney(input)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ reliquary: coins >= 5 ? 1 : 0 }),
      getCost({ reliquary: Math.floor((coins - 5) / 10) })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
