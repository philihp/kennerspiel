import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionWorkContract = () => {
  const { controls, addPartial } = useInstanceContext()

  const handleClick = () => {
    addPartial('WORK_CONTRACT')
  }

  const disabled = !(controls?.completion ?? []).includes('WORK_CONTRACT')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Work Contract
    </button>
  )
}
