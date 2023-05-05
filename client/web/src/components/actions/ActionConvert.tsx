import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionConvert = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('CONVERT')
  }

  const disabled = !(state?.control?.completion ?? []).includes('CONVERT')

  return (
    <button type="button" disabled={disabled} className={classes.action} onClick={handleClick}>
      Convert
    </button>
  )
}
