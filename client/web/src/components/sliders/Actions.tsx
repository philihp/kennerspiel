import classes from './actions.module.css'
import { useHathoraContext } from '../../context/GameContext'
import { ActionUse } from './ActionUse'
import { ActionSettle } from './ActionSettle'
import { ActionBuild } from './ActionBuild'
import { ActionCutPeat } from './ActionCutPeat'
import { ActionFellTrees } from './ActionFellTrees'
import { ActionWorkContract } from './ActionWorkContract'
import { ActionBuyPlot } from './ActionBuyPlot'
import { ActionBuyDistrict } from './ActionBuyDistrict'
import { ActionConvert } from './ActionConvert'
import { ActionCommit } from './ActionCommit'

export const Actions = () => {
  const { state } = useHathoraContext()
  const position = state?.control?.partial === '' ? 80 : 0

  return (
    <div className={classes.container} style={{ transform: `translateY(${position}px)` }}>
      <ActionCutPeat />
      <ActionFellTrees />
      <ActionBuild />
      <ActionUse />
      <ActionWorkContract />
      <ActionBuyPlot />
      <ActionBuyDistrict />
      <ActionSettle />
      <ActionConvert />
      <ActionCommit />
    </div>
  )
}
