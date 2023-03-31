import { pickFrameFlow } from './board/frame'
import { Flower, GameCommandEnum, GameStatePlaying, OrdinalFrame, ControlState } from './types'

const computeFlow = (state: GameStatePlaying) => {
  let limit = 200
  const frameFlow = pickFrameFlow(state.config)
  let frameIndex = state.frame.next
  let playerIndex = state.frame.activePlayerIndex
  let frame: OrdinalFrame = frameFlow[frameIndex]
  const flow: Flower[] = []
  do {
    playerIndex = frame.currentPlayerIndex ?? playerIndex
    flow.push({
      round: frame.round,
      player: state.players[playerIndex].color,
      settle: !!frame.bonusActions?.includes(GameCommandEnum.SETTLE),
      bonus: !!frame.bonusRoundPlacement,
    })
    frameIndex = frame.next
    frame = frameFlow[frame.next]
  } while (frameIndex < frame.next && limit--)
  return flow
}

/**
 * if given a "partial" command, possible extensions will be in "completion".
 * if nothing can be added, completion will be empty.
 * if the player is not active, then partial and completion should be undefined.
 */
export const control = (state: GameStatePlaying, partial?: string, player?: number): ControlState => ({
  ...state,
  control: {
    active: player === state.frame.activePlayerIndex,
    flow: computeFlow(state),
    partial,
    completion: [],
  },
})
