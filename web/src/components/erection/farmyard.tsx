import { useInstanceContext } from '@/context/InstanceContext'
import { useState } from 'react'
import { Modal } from '../modal'

export const Farmyard = () => {
  const { addPartial, controls } = useInstanceContext()

  const partial = controls?.partial
  const open = partial?.join(' ') === `USE LR2`

  const sendPartial = (type: 'Sh' | 'Gn') => () => {
    addPartial(type)
  }

  return (
    <>
      <Modal openModal={open}>
        <button className="primary" onClick={sendPartial('Sh')}>
          Sheep
        </button>
        <button className="primary" onClick={sendPartial('Gn')}>
          Grain
        </button>
      </Modal>
    </>
  )
}
