import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionCommit = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('COMMIT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('COMMIT')

  return (
    <button type="button" disabled={disabled} className={`${classes.action} ${classes.primary}`} onClick={handleClick}>
      Commit
    </button>
  )
}
