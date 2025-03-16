import { useInstanceContext } from '@/context/InstanceContext'
import { useState } from 'react'
import { Modal } from '../modal'
import { partiallyUsed } from './util'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'

export const FuelMerchant = () => {
  const { addPartial, setPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([BuildingEnum.FuelMerchant], controls?.partial))

  const sendPartial = (type: 'Sh' | 'Gn') => () => {
    addPartial(type)
    setOpen(false)
  }

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  return (
    <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
      <button className="primary" onClick={sendPartial('Gn')}>
        Grain
      </button>
    </Modal>
  )
}
