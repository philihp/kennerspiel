import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionBuild = () => {
  const { controls } = useInstanceContext()

  const handleClick = () => {
    // control('BUILD')
  }

  const disabled = !(controls?.completion ?? []).includes('BUILD')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Build
    </button>
  )
}
