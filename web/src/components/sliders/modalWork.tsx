import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { map } from 'ramda'
import { ItemList } from '../itemList'

export const ModalWork = () => {
  const { setPartial, addPartial, controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const [open, setOpen] = useState(
    partial[0] === 'WORK_CONTRACT' && partial[1] !== undefined && partial[2] === undefined
  )

  const options = controls?.completion ?? []

  const handleClose = () => {
    setPartial(['WORK_CONTRACT'])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  return (
    <>
      <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
        <h1>Work Contract</h1>
        How should the work contract be paid?
        <ul>
          {map<string, ReactNode>(
            (param) => (
              <li key={param}>
                <button className="primary" onClick={handleOK(param)}>
                  <ItemList items={param} />
                </button>
              </li>
            ),
            options
          )}
        </ul>
      </Modal>
    </>
  )
}
