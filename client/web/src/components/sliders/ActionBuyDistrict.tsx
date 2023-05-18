import { useHathoraContext } from '../../context/GameContext'
import classes from './actions.module.css'

export const ActionBuyDistrict = () => {
  const { state, control } = useHathoraContext()

  const handleClick = () => {
    control('BUY_DISTRICT')
  }

  const disabled = !(state?.control?.completion ?? []).includes('BUY_DISTRICT')

  return (
    <button type="button" disabled={disabled} className={classes.action} onClick={handleClick}>
      Buy District
    </button>
  )
}
