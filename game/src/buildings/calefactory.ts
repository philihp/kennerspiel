import { always, curry, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { parseResourceParam, costMoney } from '../board/resource'
import { withActivePlayer, payCost, activeLens } from '../board/player'
import { GameCommandEnum, GameStatePlaying } from '../types'
import { addBonusAction } from '../board/frame'

export const calefactory = (coin = '') => {
  const input = parseResourceParam(coin)
  if (costMoney(input) < 1) return identity
  return pipe(
    //
    withActivePlayer(payCost(input)),
    addBonusAction(GameCommandEnum.FELL_TREES),
    addBonusAction(GameCommandEnum.CUT_PEAT)
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { penny = 0 } = view(activeLens(state), state)
      if (penny) return ['Pn', '']
      return ['']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
