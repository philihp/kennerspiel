import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionConvert = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('CONVERT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('CONVERT')

  return (
    <button type="button" disabled={disabled} className={`${classes.action}`} onClick={handleClick}>
      Convert
    </button>
  )
}
