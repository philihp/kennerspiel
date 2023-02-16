import { identity, pipe } from 'ramda'
import { parseResourceParam, costMoney } from '../board/resource'
import { withActivePlayer, payCost } from '../board/player'
import { GameCommandEnum } from '../types'
import { addBonusAction } from '../board/frame/addBonusAction'

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
