import { pipe } from 'ramda'
import { revertActivePlayerToCurrent, setFrameToAllowFreeUsage, withFrame } from '../board/frame'
import { moveClergyToOwnBuilding } from '../board/landscape'
import { isPrior } from '../board/player'
import { NextUseClergy, StateReducer } from '../types'

// there are two modes of this, really...

// first, if activePlayer == currentPlayer, then make it so the next "use" is with a prior
// -> fail if they have no prior available
// -> otherwise set the nextUse = NextUseClergy.OnlyPrior
const withPriorForCurrentPlayer: StateReducer = (state) => {
  if (state === undefined) return undefined
  if (state.players[state.frame.activePlayerIndex].clergy.some(isPrior) === false) return undefined
  return withFrame((frame) => ({
    ...frame,
    nextUse: NextUseClergy.OnlyPrior,
  }))(state)
}

// second, if activePlayer != currentPlayer, as in a work contract, then
// -> move the player's prior onto the building in usableBuildings (work contracted building)
// -> set the nextUse = NextUseClergy.Free
// -> set the activePlayer back to currentPlayer
const withPriorForWorkContract: StateReducer = (state) => {
  if (state === undefined) return undefined
  if (state.frame.usableBuildings.length !== 1) return undefined
  return pipe(
    //
    withPriorForCurrentPlayer,
    moveClergyToOwnBuilding(state.frame.usableBuildings[0]),
    setFrameToAllowFreeUsage([state.frame.usableBuildings[0]]),
    revertActivePlayerToCurrent
  )(state)
}

export const withPrior: StateReducer = (state) => {
  if (state === undefined) return undefined
  if (state.frame.activePlayerIndex === state.frame.currentPlayerIndex) {
    return withPriorForCurrentPlayer(state)
  }
  return withPriorForWorkContract(state)
}
