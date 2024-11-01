import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionUse = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('USE')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('USE')

  return (
    <button type="button" disabled={disabled} className={`${classes.action} ${classes.primary}`} onClick={handleClick}>
      Use
    </button>
  )
}
