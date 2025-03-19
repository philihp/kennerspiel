import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { includes } from 'ramda'
import { ModalConvert } from './modalConvert'

export const ActionConvert = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('CONVERT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('CONVERT')
  const partial = controls?.partial ?? []
  const completion = controls?.completion ?? []
  const showModal = partial[0] === 'CONVERT' && !includes('', completion)

  return (
    <>
      <button type="button" disabled={disabled} className={`${classes.action}`} onClick={handleClick}>
        Convert
      </button>
      {showModal && <ModalConvert />}
    </>
  )
}
