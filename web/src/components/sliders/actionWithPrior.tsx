import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionWithPrior = () => {
  const { controls, addPartial } = useInstanceContext()

  const handleClick = () => {
    addPartial('WITH_PRIOR')
  }

  const disabled = !(controls?.completion ?? []).includes('WITH_PRIOR')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      With Prior
    </button>
  )
}
