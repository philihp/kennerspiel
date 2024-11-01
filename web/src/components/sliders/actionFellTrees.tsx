import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionFellTrees = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('FELL_TREES')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('FELL_TREES')

  return (
    <button type="button" disabled={disabled} className={`${classes.action} ${classes.primary}`} onClick={handleClick}>
      Fell Trees
    </button>
  )
}
