import { identity, pipe } from 'ramda'
import { parseResourceParam } from '../board/resource'
import { withActivePlayer, payCost } from '../board/player'
import { GameCommandEnum } from '../types'
import { addBonusAction, withFrame } from '../board/frame'

export const bulwark = (coin = '') => {
  const { book = 0 } = parseResourceParam(coin)
  if (book < 1) return identity
  return pipe(
    //
    withActivePlayer(payCost({ book })),
    addLandscapeGrants(2),
    addBonusAction(GameCommandEnum.BUY_DISTRICT),
    addBonusAction(GameCommandEnum.BUY_PLOT)
  )
}
