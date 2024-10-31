import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionWithLaybrother = () => {
  const { controls, addPartial } = useInstanceContext()

  const handleClick = () => {
    addPartial('WITH_LAYBROTHER')
  }

  const disabled = !(controls?.completion ?? []).includes('WITH_LAYBROTHER')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      With Laybrother
    </button>
  )
}
