import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionBuyDistrict = () => {
  const { controls, addPartial } = useInstanceContext()

  const handleClick = () => {
    addPartial('BUY_DISTRICT')
  }

  const disabled = !(controls?.completion ?? []).includes('BUY_DISTRICT')

  return (
    <button type="button" disabled={disabled} className={`${classes.action}`} onClick={handleClick}>
      Buy District
    </button>
  )
}
