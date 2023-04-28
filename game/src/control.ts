import { P, match } from 'ts-pattern'
import { always, head, reduce, toPairs } from 'ramda'
import { pickFrameFlow } from './board/frame'
import { Flower, GameCommandEnum, GameStatePlaying, OrdinalFrame, Controls, Frame } from './types'
import { complete } from './commands'

const computeFlow = (state: GameStatePlaying) => {
  const frameFlow = pickFrameFlow(state.config)
  const flow: Flower[] = []
  let limit = 200
  let frameIndex
  let playerIndex = state.frame.activePlayerIndex
  let { frame }: { frame: OrdinalFrame } = state
  let { round } = frame
  do {
    round = frame.round ?? round
    playerIndex = frame.currentPlayerIndex ?? playerIndex
    flow.push({
      round,
      player: state?.players?.[playerIndex]?.color,
      settle: !!frame.bonusActions?.includes(GameCommandEnum.SETTLE),
      bonus: !!frame.bonusRoundPlacement,
    })
    frameIndex = frame.next
    frame = frameFlow[frame.next]
  } while (frame && frameIndex < frame.next && limit--)
  return flow
}

export const control = (state: GameStatePlaying, partial: string[], player?: number): Controls => {
  const completion = match(head(partial))
    .with(undefined, () =>
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
    // this can be prettier with https://github.com/gvergnaud/ts-pattern/pull/139
    // git blame this line and see how it used to be, but i really want something like
    // .with([GameCommandEnum.Use, P.rest], complete.USE(state))
    .with(GameCommandEnum.USE, () => complete.USE(state)(partial))
    .with(GameCommandEnum.BUILD, () => complete.BUILD(state)(partial))
    .with(GameCommandEnum.CUT_PEAT, () => complete.CUT_PEAT(state)(partial))
    .with(GameCommandEnum.FELL_TREES, () => complete.FELL_TREES(state)(partial))
    .with(GameCommandEnum.WORK_CONTRACT, () => complete.WORK_CONTRACT(state)(partial))
    .with(GameCommandEnum.BUY_PLOT, () => complete.BUY_PLOT(state)(partial))
    .with(GameCommandEnum.BUY_DISTRICT, () => complete.BUY_DISTRICT(state)(partial))
    .with(GameCommandEnum.CONVERT, () => complete.CONVERT(state)(partial))
    .with(GameCommandEnum.SETTLE, () => complete.SETTLE(state)(partial))
    .otherwise(always([]))

  return {
    active: player === state.frame.activePlayerIndex,
    flow: computeFlow(state),
    partial,
    completion,
  }
}
