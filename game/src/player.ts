import { pickFrameFlow } from './board/frame'
import { Flower, GameCommandEnum, GameStatePlaying, OrdinalFrame, PlayerState } from './types'

export const view = (state: GameStatePlaying, player: number): PlayerState => {
  let limit = 1000
  const flow: Flower[] = []
  const frameFlow = pickFrameFlow(state.config)
  let frameIndex = state.frame.next
  let playerIndex = state.frame.activePlayerIndex
  let frame: OrdinalFrame = frameFlow[frameIndex]
  do {
    flow.push({
      player: state.players[playerIndex].color,
      settle: !!frame.bonusActions?.includes(GameCommandEnum.SETTLE),
      bonus: !!frame.bonusRoundPlacement,
    })
    frameIndex = frame.next
    frame = frameFlow[frame.next]
    playerIndex = frame.currentPlayerIndex ?? playerIndex
  } while (frameIndex < frame.next && limit--)
  return {
    ...state,
    flow,
    control: {
      cutPeat: true,
      fellTrees: true,
      build: true,
      workContract: true,
      withPrior: true,
      withLaybrother: true,
      use: true,
      settle: true,
      commit: true,
    },
  }
}
