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
import { map } from 'ramda'
import { ModalPriorChoice } from './modalPriorChoice'

export const Actions = () => {
  const { controls, state, partial, setPartial, move, active } = useInstanceContext()
  const completion = controls?.completion ?? []

  const handleClear = () => {
    setPartial([])
  }

  const handleSend = async () => {
    await move()
  }

  return (
    <>
      <div>
        <input
          disabled
          type="text"
          value={partial.join(' ')}
          className="disabled code"
          style={{
            padding: 8,
          }}
        />
        <button type="button" disabled={!active || controls?.partial?.length === 0} onClick={handleClear}>
          &#x25C3; Reset
        </button>
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
        {process.env.NODE_ENV !== 'production' && (
          <ul style={{ display: 'inline' }}>
            {map(
              (completion) => (
                <li
                  key={completion}
                  style={{
                    display: 'inline',
                    border: '1px solid rgba(82, 0, 57, 0.09)',
                    borderRadius: 8,
                    backgroundColor: 'rgba(255, 206, 240, 0.45)',
                    padding: 4,
                    marginLeft: 4,
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(82, 0, 57, 0.28)',
                      fontSize: 12,
                      fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
                    }}
                  >
                    {completion}
                  </span>
                </li>
              ),
              controls?.completion ?? []
            )}
          </ul>
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
