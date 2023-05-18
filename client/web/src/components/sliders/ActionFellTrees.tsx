import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionFellTrees = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('FELL_TREES')
  }

  const disabled = !(state?.control?.completion ?? []).includes('FELL_TREES')

  return (
    <button type="button" disabled={disabled} className={classes.action} onClick={handleClick}>
      Fell Trees
    </button>
  )
}
