import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionUse = () => {
  const { controls } = useInstanceContext()

  const handleClick = () => {
    // control('USE')
  }

  const disabled = !(controls?.completion ?? []).includes('USE')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Use
    </button>
  )
}
