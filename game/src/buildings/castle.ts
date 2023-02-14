import { withFrame } from '../board/frame'
import { GameCommandEnum, GameStatePlaying } from '../types'

export const castle = () =>
  withFrame((frame) => ({
    ...frame,
    bonusActions: [GameCommandEnum.SETTLE],
  }))
