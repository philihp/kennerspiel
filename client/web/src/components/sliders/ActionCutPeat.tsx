import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionCutPeat = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('CUT_PEAT')
  }

  const disabled = !(state?.control?.completion ?? []).includes('CUT_PEAT')

  return (
    <button type="button" disabled={disabled} className={classes.action} onClick={handleClick}>
      Cut Peat
    </button>
  )
}
