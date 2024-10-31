import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionWorkContract = () => {
  const { controls } = useInstanceContext()

  const handleClick = () => {
    // control('WORK_CONTRACT')
  }

  const disabled = !(controls?.completion ?? []).includes('WORK_CONTRACT')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Work Contract
    </button>
  )
}
