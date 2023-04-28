import { match } from 'ts-pattern'
import { always, head, reduce, toPairs, unnest } from 'ramda'
import { pickFrameFlow } from './board/frame'
import { Flower, GameCommandEnum, GameStatePlaying, OrdinalFrame, Controls } from './types'
import {
  completeBuild,
  completeCommit,
  completeConvert,
  completeCutPeat,
  completeFellTrees,
  completeSettle,
  completeUse,
  completeWorkContract,
  completeWithLaybrother,
  completeWithPrior,
  completeBuyPlot,
  completeBuyDistrict,
} from './commands'

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
    .with(undefined, () => [
      ...completeUse(state)([]),
      ...completeBuild(state)([]),
      ...completeCutPeat(state)([]),
      ...completeFellTrees(state)([]),
      ...completeWorkContract(state)([]),
      ...completeBuyPlot(state)([]),
      ...completeBuyDistrict(state)([]),
      ...completeConvert(state)([]),
      ...completeSettle(state)([]),
      ...completeWithLaybrother(state)([]),
      ...completeWithPrior(state)([]),
      ...completeCommit(state)([]),
    ])
    // this can be prettier with https://github.com/gvergnaud/ts-pattern/pull/139
    // git blame this line and see how it used to be, but i really want something like
    // .with([GameCommandEnum.Use, P.rest], complete.USE(state))
    .with(GameCommandEnum.USE, () => completeUse(state)(partial))
    .with(GameCommandEnum.BUILD, () => completeBuild(state)(partial))
    .with(GameCommandEnum.CUT_PEAT, () => completeCutPeat(state)(partial))
    .with(GameCommandEnum.FELL_TREES, () => completeFellTrees(state)(partial))
    .with(GameCommandEnum.WORK_CONTRACT, () => completeWorkContract(state)(partial))
    .with(GameCommandEnum.BUY_PLOT, () => completeBuyPlot(state)(partial))
    .with(GameCommandEnum.BUY_DISTRICT, () => completeBuyDistrict(state)(partial))
    .with(GameCommandEnum.CONVERT, () => completeConvert(state)(partial))
    .with(GameCommandEnum.SETTLE, () => completeSettle(state)(partial))
    .with(GameCommandEnum.WITH_LAYBROTHER, () => completeWithLaybrother(state)(partial))
    .with(GameCommandEnum.WITH_PRIOR, () => completeWithPrior(state)(partial))
    .with(GameCommandEnum.COMMIT, () => completeCommit(state)(partial))
    .otherwise(always([]))

  return {
    active: player === state.frame.activePlayerIndex,
    flow: computeFlow(state),
    partial,
    completion,
  }
}
