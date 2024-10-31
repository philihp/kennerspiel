import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionBuild = () => {
  const { controls, addPartial } = useInstanceContext()

  const handleClick = () => {
    addPartial('BUILD')
  }

  const disabled = !(controls?.completion ?? []).includes('BUILD')

  return (
    <button type="button" disabled={disabled} className={`${classes.action} ${classes.primary}`} onClick={handleClick}>
      Build
    </button>
  )
}
