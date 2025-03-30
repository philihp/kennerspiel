import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { GameCommandEnum } from 'hathora-et-labora-game/dist/types'
import { intersection, isEmpty } from 'ramda'

export const ActionCommit = () => {
  const { state, controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('COMMIT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('COMMIT')

  const usableBonusAction = isEmpty(
    intersection(state?.frame?.bonusActions ?? [], [
      GameCommandEnum.CUT_PEAT,
      GameCommandEnum.FELL_TREES,
      GameCommandEnum.BUILD,
      GameCommandEnum.USE,
      GameCommandEnum.WORK_CONTRACT,
      GameCommandEnum.SETTLE,
    ])
  )

  const maybeDont =
    ((state?.frame?.bonusActions ?? []).length > 0 &&
      !state?.frame?.bonusActions?.includes(GameCommandEnum.COMMIT) &&
      usableBonusAction) ||
    state?.frame?.usableBuildings?.length !== 0 ||
    state?.frame?.mainActionUsed !== true

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={`${classes.action} ${maybeDont ? '' : classes.primary}`}
        onClick={handleClick}
      >
        Commit
      </button>
      <pre>
        {JSON.stringify(
          {
            frame: state?.frame,
            maybeDont,
            t1a: (state?.frame?.bonusActions ?? []).length > 0,
            t1b: !state?.frame?.bonusActions?.includes(GameCommandEnum.COMMIT),
            t2: state?.frame?.usableBuildings?.length !== 0,
            t3: state?.frame?.mainActionUsed !== true,
          },
          null,
          2
        )}
      </pre>
    </>
  )
}
