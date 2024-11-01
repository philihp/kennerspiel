import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionBuyPlot = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('BUY_PLOT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('BUY_PLOT')

  return (
    <button type="button" disabled={disabled} className={`${classes.action}`} onClick={handleClick}>
      Buy Plot
    </button>
  )
}
