import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionCommit = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('COMMIT')
  }

  const disabled = !(state?.control?.completion ?? []).includes('COMMIT')

  return (
    <button type="button" disabled={disabled} className={classes.action} onClick={handleClick}>
      Commit
    </button>
  )
}
