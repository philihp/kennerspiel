import { lensPath, set } from 'ramda'
import { GameCommandEnum, GameStatePlaying, StateReducer } from '../../types'

const frameBonusActions = lensPath(['frame', 'bonusActions'])

export const checkSoloSettlementReady: StateReducer = (state) =>
  state &&
  // if we start the frame with buildings, only allow building them, otherwise only allow settle (or commit)
  set<GameStatePlaying, GameCommandEnum[]>(
    frameBonusActions,
    state.buildings.length !== 0 ? [GameCommandEnum.BUILD] : [GameCommandEnum.SETTLE],
    state
  )
