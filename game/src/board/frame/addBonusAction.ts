import { GameCommandEnum } from '../../types'
import { withFrame } from '../frame'

export const addBonusAction = (command: GameCommandEnum) =>
  withFrame((frame) => ({
    ...frame,
    bonusActions: [...frame.bonusActions, command],
  }))
