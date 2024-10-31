import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionFellTrees = () => {
  const { controls, addPartial } = useInstanceContext()

  const handleClick = () => {
    addPartial('FELL_TREES')
  }

  const disabled = !(controls?.completion ?? []).includes('FELL_TREES')

  return (
    <button type="button" disabled={disabled} className={`${classes.action} ${classes.primary}`} onClick={handleClick}>
      Fell Trees
    </button>
  )
}
