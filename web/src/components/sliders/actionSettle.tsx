import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionSettle = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('SETTLE')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('SETTLE')

  return (
    <button type="button" disabled={disabled} className={`${classes.action} ${classes.primary}`} onClick={handleClick}>
      Settle
    </button>
  )
}
