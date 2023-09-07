import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionSettle = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('SETTLE')
  }

  const disabled = !(state?.control?.completion ?? []).includes('SETTLE')

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${!disabled ? 'primary' : ''} ${classes.action}`}
      onClick={handleClick}
    >
      Settle
    </button>
  )
}
