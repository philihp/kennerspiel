import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionCutPeat = () => {
  const { controls, addPartial } = useInstanceContext()

  const handleClick = () => {
    addPartial('CUT_PEAT')
  }

  const disabled = !(controls?.completion ?? []).includes('CUT_PEAT')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Cut Peat
    </button>
  )
}
