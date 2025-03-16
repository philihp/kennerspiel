import { useInstanceContext } from '@/context/InstanceContext'
import { useState } from 'react'
import { Modal } from '../modal'

export const FuelMerchant = () => {
  const { addPartial, clearPartial, controls, monotonic } = useInstanceContext()

  const partial = controls?.partial

  const [open, setOpen] = useState(partial?.join(' ') === `USE G06`)

  const sendPartial = (type: 'Sh' | 'Gn') => () => {
    addPartial(type)
    setOpen(false)
  }

  const handleClose = () => {
    clearPartial()
    addPartial('USE') //no
    setOpen(false)
  }

  return (
    <Modal key={monotonic} closeModal={handleClose} openModal={open} close={'Cancel'}>
      <button className="primary" onClick={sendPartial('Gn')}>
        Grain
      </button>
    </Modal>
  )
}
