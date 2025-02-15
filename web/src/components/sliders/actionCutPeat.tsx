import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionCutPeat = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('CUT_PEAT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('CUT_PEAT')

  return (
    <button type="button" disabled={disabled} className={`${classes.action} ${classes.primary}`} onClick={handleClick}>
      Cut Peat
    </button>
  )
}
