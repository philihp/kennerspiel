import { always, curry, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const buildersMarket = (param = '') => {
  const { penny = 0 } = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      payCost({ penny }),
      penny >= 2 ? getCost({ wood: 2, clay: 2, stone: 1, straw: 1 }) : identity
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      if (costMoney(view(activeLens(state), state)) < 2) return ['']
      return ['PnPn', '']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
