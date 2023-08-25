import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionUse = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('USE')
  }

  const disabled = !(state?.control?.completion ?? []).includes('USE')

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${!disabled ? 'primary' : ''} ${classes.action}`}
      onClick={handleClick}
    >
      Use
    </button>
  )
}
