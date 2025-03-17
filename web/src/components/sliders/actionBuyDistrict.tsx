import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { ModalWork } from './modalWork'
import { ModalBuyDistrict } from './modalBuyDistrict'
import { includes } from 'ramda'

export const ActionBuyDistrict = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('BUY_DISTRICT')
  }

  const completion = controls?.completion ?? []
  const disabled = !active || !completion.includes('BUY_DISTRICT')
  const partial = controls?.partial ?? []
  const showModal = partial[0] === 'BUY_DISTRICT' && !includes('', completion)

  return (
    <>
      <button type="button" disabled={disabled} className={`${classes.action}`} onClick={handleClick}>
        Buy District
      </button>
      {showModal && <ModalBuyDistrict />}
    </>
  )
}
