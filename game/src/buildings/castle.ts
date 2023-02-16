import { addBonusAction } from '../board/frame'
import { GameCommandEnum } from '../types'

export const castle = () => addBonusAction(GameCommandEnum.SETTLE)
