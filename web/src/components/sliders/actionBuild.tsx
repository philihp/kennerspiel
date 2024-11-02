import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionBuild = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('BUILD')
  }

  const disabled = !(controls?.completion ?? []).includes('BUILD')

  return (
    <button type="button" disabled={!active || disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Build
    </button>
  )
}
