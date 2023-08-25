import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionBuild = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('BUILD')
  }

  const disabled = !(state?.control?.completion ?? []).includes('BUILD')

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${!disabled ? 'primary' : ''} ${classes.action}`}
      onClick={handleClick}
    >
      Build
    </button>
  )
}
