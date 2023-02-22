import { Frame, FrameFlow, StateReducer } from '../../types'

// 2p long game...
// each round:
// rotate wheel
// starting player has two actions
// other player has one action
// game enters final phase when:
// - D buildings go out AND
// - there are no more than 3 buildings left in display
// finish current round

// each round, starting player gets 2 actions followed by other player getting 1
// each player can build at most 1 landscape every round
// ending when after settlement D, when there are <= 3 buildings in display finish current round

export const nextFrame2Long: FrameFlow = {
  // TODO
  1: {
    next: 1,
  },
}
