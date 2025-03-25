import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { ModalCutPeat } from './modalCutPeat'

export const ActionCutPeat = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('CUT_PEAT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('CUT_PEAT')
  const partial = controls?.partial ?? []
  const showModal = partial[0] === 'CUT_PEAT' && partial.length === 3

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={`${classes.action} ${classes.primary}`}
        onClick={handleClick}
      >
        Cut Peat
      </button>
      {showModal && <ModalCutPeat />}
    </>
  )
}
