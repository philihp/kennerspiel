import { P, match } from 'ts-pattern'
import { always, reduce, toPairs } from 'ramda'
import { pickFrameFlow } from './board/frame'
import { Flower, GameCommandEnum, GameStatePlaying, OrdinalFrame, Controls } from './types'
import { complete } from './commands'

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

export const control = (state: GameStatePlaying, partial: string[], player?: number): Controls => {
  const completion = match(partial)
    .with([], () =>
      reduce(
        (accum, pair) => {
          const [_command, complete] = pair
          accum.push(...complete(state)(partial))
          return accum
        },
        [] as string[],
        toPairs(complete) as [GameCommandEnum, (state: GameStatePlaying) => (partial: string[]) => string[]][]
      )
    )
    .with([GameCommandEnum.USE], [GameCommandEnum.USE, P._], [GameCommandEnum.USE, P._, P._], complete.USE(state))
    .with([GameCommandEnum.BUILD], complete.BUILD(state))
    .with([GameCommandEnum.CUT_PEAT], complete.CUT_PEAT(state))
    .with([GameCommandEnum.FELL_TREES], complete.FELL_TREES(state))
    .with([GameCommandEnum.WORK_CONTRACT], complete.WORK_CONTRACT(state))
    .with([GameCommandEnum.BUY_PLOT], complete.BUY_PLOT(state))
    .with([GameCommandEnum.BUY_DISTRICT], complete.BUY_DISTRICT(state))
    .with([GameCommandEnum.CONVERT], complete.CONVERT(state))
    .with([GameCommandEnum.SETTLE], complete.SETTLE(state))
    .otherwise(always([]))

  return {
    active: player === state.frame.activePlayerIndex,
    flow: computeFlow(state),
    partial,
    completion,
  }
}
