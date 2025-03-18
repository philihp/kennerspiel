import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { ModalSettle } from './modalSettle'
import { includes } from 'ramda'

export const ActionSettle = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('SETTLE')
  }

  const completion = controls?.completion ?? []
  const disabled = !active || !completion.includes('SETTLE')
  const partial = controls?.partial ?? []
  const showModal =
    partial[0] === 'SETTLE' &&
    partial[1] !== undefined &&
    partial[2] !== undefined &&
    partial[3] !== undefined &&
    !includes('', completion)

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={`${classes.action} ${classes.primary}`}
        onClick={handleClick}
      >
        Settle
      </button>
      {showModal && <ModalSettle />}
    </>
  )
}
