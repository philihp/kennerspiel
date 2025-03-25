import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { map } from 'ramda'
import { ItemList } from '../itemList'
import { match } from 'ts-pattern'
import { ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { take } from '../rondel/values'
import { symbols } from '../rondel/rondel'

export const ModalCutPeat = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const [open, setOpen] = useState(partial[0] === 'CUT_PEAT' && partial.length === 3)

  const options = controls?.completion ?? []

  const handleClose = () => {
    setPartial(['CUT_PEAT'])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  return (
    <>
      <Modal title="Cut Peat" closeModal={handleClose} openModal={open} close={'Cancel'}>
        {map<string, ReactNode>(
          (param) =>
            match(param)
              .with('', () => (
                <button key={param} className="primary" onClick={handleOK(param)}>
                  Take {take(state?.rondel?.pointingBefore!, state?.rondel?.peat!, state?.config!)} peat with{' '}
                  {symbols.peat}
                </button>
              ))
              .with(ResourceEnum.Joker, () => (
                <button key={param} className="primary" onClick={handleOK(param)}>
                  Take {take(state?.rondel?.pointingBefore!, state?.rondel?.joker!, state?.config!)} peat with{' '}
                  {symbols.joker}
                </button>
              ))
              .otherwise(() => (
                <button key={param} className="primary" onClick={handleOK(param)}>
                  <ItemList items={param} />
                </button>
              )),
          options
        )}
      </Modal>
    </>
  )
}
