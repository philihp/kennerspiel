import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionBuyPlot = () => {
  const { controls } = useInstanceContext()

  const handleClick = () => {
    // control('BUY_PLOT')
  }

  const disabled = !(controls?.completion ?? []).includes('BUY_PLOT')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Buy Plot
    </button>
  )
}
