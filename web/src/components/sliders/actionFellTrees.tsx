import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { ModalFellTrees } from './modalFellTrees'

export const ActionFellTrees = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('FELL_TREES')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('FELL_TREES')
  const partial = controls?.partial ?? []
  const showModal = partial[0] === 'FELL_TREES' && partial.length === 3

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={`${classes.action} ${classes.primary}`}
        onClick={handleClick}
      >
        Fell Trees
      </button>
      {showModal && <ModalFellTrees />}
    </>
  )
}
