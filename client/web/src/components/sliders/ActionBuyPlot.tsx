import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionBuyPlot = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('BUY_PLOT')
  }

  const disabled = !(state?.control?.completion ?? []).includes('BUY_PLOT')

  return (
    <button type="button" disabled={disabled} className={classes.action} onClick={handleClick}>
      Buy Plot
    </button>
  )
}
