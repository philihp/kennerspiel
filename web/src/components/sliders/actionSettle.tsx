import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionSettle = () => {
  const { controls } = useInstanceContext()

  const handleClick = () => {
    // control('SETTLE')
  }

  const disabled = !(controls?.completion ?? []).includes('SETTLE')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Settle
    </button>
  )
}
