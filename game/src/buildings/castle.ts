import { always, curry } from 'ramda'
import { match } from 'ts-pattern'
import { addBonusAction } from '../board/frame'
import { GameCommandEnum, GameState } from '../types'

export const castle = () => addBonusAction(GameCommandEnum.SETTLE)

export const complete = curry((partial: string[], _state: GameState): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)
