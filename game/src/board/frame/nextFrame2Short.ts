import { Frame, FrameFlow, StateReducer } from '../../types'

// 2p short game...
// alternate turns:
// - push wheel
// --- grapes at round 11 (france)
// --- stone at round 18
// - return clergymen (both players)
// - potentially settlement round
// - take two actions
// - buy a landscape once per "turn" and once per settlement
// no bonus round
// no fixed end; final phase when:
// - D buildings go out AND
// - there is at most 1 building left in display
// play current turn through to the end
// then rotate the production wheel
// other player gets 1 final action

// Two players take turns.
// - Rotate the wheel
// --- If it's a settlement, then do settlement
// --- Reset has player bought landscape
// --- Do a settlement
// - Reset has player obught a settlement
// - Active player gets 2 actions
// Clergy return for both players at the end of each turn
// ending when after settlement D, when there are <= 1 buildings in display. Finish current turn and other player gets 1 final action.

export const nextFrame2Short: FrameFlow = {
  // TODO
  1: {
    next: 1,
  },
}
