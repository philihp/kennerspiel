import { XCircle } from 'lucide-react'

import classes from './actions.module.css'
import { useInstanceContext } from '@/context/InstanceContext'

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
import { ModalPriorChoice } from './modalPriorChoice'

export const Actions = () => {
  const { controls, state, partial, setPartial, move, active } = useInstanceContext()
  const completion = controls?.completion ?? []

  const cancelDisabled = !active || controls?.partial?.length === 0

  const handleClear = () => {
    setPartial([])
  }

  const handleSend = async () => {
    await move()
  }

  return (
    <>
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          position: 'sticky',
          top: 0,
          border: '1px solid white',
          paddingLeft: 10,
          paddingRight: 10,
          marginRight: '10%',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          borderTop: 0,
        }}
      >
        <button
          className="primary"
          style={{
            display: 'inline-flex',
            gap: '8px',
          }}
          type="button"
          disabled={cancelDisabled}
          onClick={handleClear}
        >
          <XCircle size={12} color={'#fff' /* '#007AFF' */} />
        </button>
        <input
          disabled
          type="text"
          value={partial.join(' ')}
          className="disabled code"
          style={{
            borderWidth: 0,
            marginLeft: 3,
            paddingLeft: 10,
            paddingTop: 5,
            paddingBottom: 5,
          }}
        />
        {controls?.completion?.includes('') && (
          <button
            type="button"
            disabled={!active || !completion?.includes('')}
            className={`primary ${classes.action}`}
            onClick={handleSend}
          >
            Send &#x25B6;
          </button>
        )}
      </div>
      <div className={classes.container}>
        {completion?.includes('WITH_LAYBROTHER') === true && (
          <>
            <br />
            <ActionWithLaybrother />
            <ActionWithPrior />
            <ModalPriorChoice />
          </>
        )}
        {completion?.includes('WITH_LAYBROTHER') === false && (
          <>
            <br />
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
