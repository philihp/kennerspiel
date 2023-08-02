import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionWithLaybrother = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('WITH_LAYBROTHER')
  }

  const disabled = !(state?.control?.completion ?? []).includes('WITH_LAYBROTHER')

  return (
    <button type="button" disabled={disabled} className={classes.action} onClick={handleClick}>
      With Laybrother
    </button>
  )
}
