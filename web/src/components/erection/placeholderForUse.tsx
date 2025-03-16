import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { useState } from 'react'
import { partiallyUsed } from './util'

export const PlaceholderForUse = () => {
  const { controls, setPartial } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([], controls?.partial))

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  return (
    <Modal title="Placeholder" openModal={open} closeModal={handleClose}>
      Placeholder
    </Modal>
  )
}
