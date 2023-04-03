import { always, curry, toPairs } from 'ramda'
import { complete as completeBuild } from './build'
import { complete as completeCommit } from './commit'
import { complete as completeConvert } from './convert'
import { complete as completeCutPeat } from './cutPeat'
import { complete as completeFellTrees } from './fellTrees'
import { complete as completeSettle } from './settle'
import { complete as completeUse } from './use'
import { complete as completeWorkContract } from './workContract'
import { complete as completeWithLaybrother } from './withLaybrother'
import { complete as completeWithPrior } from './withPrior'
import { complete as completeBuyPlot } from './buyPlot'
import { complete as completeBuyDistrict } from './buyDistrict'
import { GameCommandEnum, GameStatePlaying } from '../types'

export { build } from './build'
export { commit } from './commit'
export { config } from './config'
export { convert } from './convert'
export { cutPeat } from './cutPeat'
export { fellTrees } from './fellTrees'
export { settle } from './settle'
export { start } from './start'
export { use } from './use'
export { workContract } from './workContract'
export { withLaybrother } from './withLaybrother'
export { withPrior } from './withPrior'
export { buyPlot } from './buyPlot'
export { buyDistrict } from './buyDistrict'

/**
 * These completion functions will return a list of command strings you could append to the partial list of command strings (which
 * is basically just a command tokenized by spaces). So it follows that if you give it a partial=[], then something like completeWorkContract
 * would return ["WORK_CONTRACT"] if it thought that the active player has a legal command they can do with that (that is, they can pay the
 * fee, and at least one other player has a clergy free).
 *
 * If an empty string is included, then the command thinks the partial command can be submitted as it is.
 */
export const complete: Record<GameCommandEnum, (state: GameStatePlaying) => (partial: string[]) => string[]> = {
  [GameCommandEnum.START]: always(always([])),
  [GameCommandEnum.CONFIG]: always(always([])),
  [GameCommandEnum.BUILD]: completeBuild,
  [GameCommandEnum.COMMIT]: completeCommit,
  [GameCommandEnum.CONVERT]: completeConvert,
  [GameCommandEnum.CUT_PEAT]: completeCutPeat,
  [GameCommandEnum.FELL_TREES]: completeFellTrees,
  [GameCommandEnum.SETTLE]: completeSettle,
  [GameCommandEnum.USE]: completeUse,
  [GameCommandEnum.WORK_CONTRACT]: completeWorkContract,
  [GameCommandEnum.WITH_LAYBROTHER]: completeWithLaybrother,
  [GameCommandEnum.WITH_PRIOR]: completeWithPrior,
  [GameCommandEnum.BUY_PLOT]: completeBuyPlot,
  [GameCommandEnum.BUY_DISTRICT]: completeBuyDistrict,
}
