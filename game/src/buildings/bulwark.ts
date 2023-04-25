import { always, curry, identity, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { parseResourceParam } from '../board/resource'
import { withActivePlayer, payCost } from '../board/player'
import { GameCommandEnum, GameStatePlaying } from '../types'
import { addBonusAction } from '../board/frame'

export const bulwark = (coin = '') => {
  const { book = 0 } = parseResourceParam(coin)
  if (book < 1) return identity
  return pipe(
    //
    withActivePlayer(payCost({ book })),
    addBonusAction(GameCommandEnum.BUY_DISTRICT),
    addBonusAction(GameCommandEnum.BUY_PLOT)
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always([]))
    .with([P._], always(['']))
    .otherwise(always([]))
)
