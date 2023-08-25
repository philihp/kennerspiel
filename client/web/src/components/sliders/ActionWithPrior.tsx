import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionwithPrior = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('WITH_PRIOR')
  }

  const disabled = !(state?.control?.completion ?? []).includes('WITH_PRIOR')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      With Prior
    </button>
  )
}
