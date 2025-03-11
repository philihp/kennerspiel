import { useTranslations } from 'next-intl'
import { GameStatePlaying } from 'hathora-et-labora-game'

import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { ActionWithLaybrother } from './actionWithLaybrother'
import { ActionWithPrior } from './actionWithPrior'
import { ActionCutPeat } from './actionCutPeat'
import { ActionFellTrees } from './actionFellTrees'
import { ActionBuild } from './actionBuild'
import { ActionUse } from './actionUse'
import { ActionWorkContract } from './actionWorkContract'
import { ActionBuyPlot } from './actionBuyPlot'
import { ActionBuyDistrict } from './actionBuyDistrict'
import { ActionConvert } from './actionConvert'
import { ActionSettle } from './actionSettle'
import { ActionCommit } from './actionCommit'

export const Actions = () => {
  const t = useTranslations('components/sliders')

  const { controls, state, partial, clearPartial, move, active } = useInstanceContext()
  const completion = controls?.completion ?? []

  const handleClear = () => {
    clearPartial()
  }

  const handleSend = async () => {
    await move()
  }

  return (
    <>
      <div>
        {t('partial-length-info', { partialLength: partial.length })}
        {partial.join(' ')}
        <button type="button" disabled={!active || controls?.partial?.length === 0} onClick={handleClear}>
          {t('reset-button-label')}
        </button>
        {controls?.completion?.includes('') && (
          <button
            type="button"
            disabled={!active || !completion?.includes('')}
            className={`primary ${classes.action}`}
            onClick={handleSend}
          >
            {t('send-button-label')}
          </button>
        )}
      </div>
      <div className={classes.container}>
        {completion?.includes('WITH_LAYBROTHER') === true && (
          <>
            <ActionWithLaybrother />
            <ActionWithPrior />
          </>
        )}
        {completion?.includes('WITH_LAYBROTHER') === false && (
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
        <ActionCommit />

        {/* {partial === '' && (
          <>
            <button type="button" className={classes.action} onClick={() => setPartial('')}>
              Clear
            </button>
            <div>
              <code>{partial}</code>
              Picker
            </div>
            <button
              type="button"
              disabled={!completion?.includes('')}
              className={`primary ${classes.action}`}
              onClick={handleSend}
            >
              Send Move
            </button>
          </>
        )} */}
      </div>
    </>
  )
}
