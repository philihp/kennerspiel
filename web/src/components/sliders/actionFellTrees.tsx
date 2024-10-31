import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionFellTrees = () => {
  const { controls } = useInstanceContext()

  const handleClick = () => {
    // control('FELL_TREES')
  }

  const disabled = !(controls?.completion ?? []).includes('FELL_TREES')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Fell Trees
    </button>
  )
}
