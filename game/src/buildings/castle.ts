import { addBonusAction } from '../board/frame/addBonusAction'
import { GameCommandEnum } from '../types'

export const castle = () => addBonusAction(GameCommandEnum.SETTLE)
