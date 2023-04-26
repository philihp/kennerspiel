import { always, curry, identity, map, pipe, range, reverse, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { withActivePlayer, payCost, activeLens } from '../board/player'
import { GameCommandEnum, GameStatePlaying, ResourceEnum } from '../types'
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
    .with([], () => {
      const { book = 0 } = view(activeLens(state), state)
      return map<number, string>(stringRepeater(ResourceEnum.Book), reverse<number>(range(0, 1 + Math.min(book, 1))))
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)
