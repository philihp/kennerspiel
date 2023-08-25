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
import { Picker } from '../Picker'
import { ActionWithLaybrother } from './ActionWithLaybrother'
import { ActionwithPrior } from './ActionWithPrior'

export const Actions = () => {
  const { state, move, control } = useHathoraContext()
  const position = state?.control ? 80 : 0

  const handleSend = () => {
    if (state?.control?.partial) {
      control('')
      move(state?.control?.partial)
    }
  }

  return (
    <div className={classes.container} style={{ transform: `translateY(${position}px)` }}>
      {state?.control?.partial === '' && (
        <>
          {state?.control?.completion?.includes('WITH_LAYBROTHER') === true && (
            <>
              <ActionWithLaybrother />
              <ActionwithPrior />
            </>
          )}
          {state?.control?.completion?.includes('WITH_LAYBROTHER') === false && (
            <>
              <ActionCutPeat />
              <ActionFellTrees />
              <ActionBuild />
              <ActionUse />
              <ActionWorkContract />
              <ActionBuyPlot />
              <ActionBuyDistrict />
              <ActionConvert />
              <ActionSettle />
            </>
          )}
        </>
      )}
      {state?.control?.partial !== '' && (
        <>
          <button type="button" className={classes.action} onClick={() => control('')}>
            Clear
          </button>
          <div>
            <code>{state?.control?.partial}</code>
            <Picker />
          </div>
          <button
            type="button"
            disabled={!state?.control?.completion?.includes('')}
            className={`primary ${classes.action}`}
            onClick={handleSend}
          >
            Send Move
          </button>
        </>
      )}
    </div>
  )
}
