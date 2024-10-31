import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionBuyDistrict = () => {
  const { controls } = useInstanceContext()

  const handleClick = () => {
    // control('BUY_DISTRICT')
  }

  const disabled = !(controls?.completion ?? []).includes('BUY_DISTRICT')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Buy District
    </button>
  )
}
