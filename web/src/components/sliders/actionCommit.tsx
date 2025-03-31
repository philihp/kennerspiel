import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { GameCommandEnum } from 'hathora-et-labora-game/dist/types'
import { intersection, isEmpty, isNotEmpty } from 'ramda'

export const ActionCommit = () => {
  const { state, controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('COMMIT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('COMMIT')

  const maybeDont =
    isNotEmpty(
      intersection(
        [
          GameCommandEnum.CUT_PEAT,
          GameCommandEnum.FELL_TREES,
          GameCommandEnum.BUILD,
          GameCommandEnum.USE,
          GameCommandEnum.WORK_CONTRACT,
          GameCommandEnum.SETTLE,
        ],
        state?.frame?.bonusActions ?? []
      )
    ) ||
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
    </>
  )
}
