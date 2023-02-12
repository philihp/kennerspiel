import { GameStatePlaying, SettlementRound } from '../../types'
import { roundBuildings } from '../buildings'

export const introduceBuildings = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  return {
    ...state,
    buildings: roundBuildings(state.config, state.frame.settlementRound),
  }
}
