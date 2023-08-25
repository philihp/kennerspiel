import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionWorkContract = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('WORK_CONTRACT')
  }

  const disabled = !(state?.control?.completion ?? []).includes('WORK_CONTRACT')

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${!disabled ? 'primary' : ''} ${classes.action}`}
      onClick={handleClick}
    >
      Work Contract
    </button>
  )
}
