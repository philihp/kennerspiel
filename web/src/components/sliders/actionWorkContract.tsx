import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { ModalWork } from './modalWork'

export const ActionWorkContract = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('WORK_CONTRACT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('WORK_CONTRACT')

  const partial = controls?.partial ?? []
  const showModal = partial[0] === 'WORK_CONTRACT' && partial[1] !== undefined && partial[2] === undefined

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={`${classes.action} ${classes.primary}`}
        onClick={handleClick}
      >
        Work Contract
      </button>
      {showModal && <ModalWork />}
    </>
  )
}
