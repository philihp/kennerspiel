import { GameStatePlaying } from 'hathora-et-labora-game'

import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const Actions = () => {
  const { controls, state, partial, setPartial } = useInstanceContext()
  const completion = controls?.completion ?? []
  const position = completion.length > 0 ? 80 : 0

  const handleSend = () => {
    if (partial) {
      setPartial('')
    }
  }

  return (
    <>
      <div className={classes.container} style={{ transform: `translateY(${position}px)` }}>
        {partial === '' && (
          <>
            {completion?.includes('WITH_LAYBROTHER') === true && (
              <>
                <div>ActionWithLaybrother</div>
                <div>ActionwithPrior</div>
              </>
            )}
            {completion?.includes('WITH_LAYBROTHER') === false && (
              <>
                <div>ActionCutPeat</div>
                <div>ActionFellTrees</div>
                <div>ActionBuild</div>
                <div>ActionUse</div>
                <div>ActionWorkContract</div>
                <div>ActionBuyPlot</div>
                <div>ActionBuyDistrict</div>
                <div>ActionConvert</div>
                <div>ActionSettle</div>
              </>
            )}
          </>
        )}
        {partial === '' && (
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
        )}
      </div>
    </>
  )
}
