import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionCutPeat = () => {
  const { state, control } = useHathoraContext()
  const completion = state?.control?.completion ?? []

  const handleClick = () => {
    control('CUT_PEAT')
  }

  const disabled = !completion.includes('CUT_PEAT')

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${!disabled ? 'primary' : ''} ${classes.action}`}
      onClick={handleClick}
    >
      Cut Peat
    </button>
  )
}
