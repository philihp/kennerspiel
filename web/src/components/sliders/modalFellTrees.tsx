import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { map } from 'ramda'
import { ItemList } from '../itemList'
import { match } from 'ts-pattern'
import { ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { take } from '../rondel/values'
import { symbols } from '../rondel/rondel'

export const ModalFellTrees = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const [open, setOpen] = useState(partial[0] === 'FELL_TREES' && partial.length === 3)

  const options = controls?.completion ?? []

  const handleClose = () => {
    setPartial(['FELL_TREES'])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  return (
    <>
      <Modal title="Fell Trees" closeModal={handleClose} openModal={open} close={'Cancel'}>
        {map<string, ReactNode>(
          (param) =>
            match(param)
              .with('', () => (
                <button key={param} className="primary" onClick={handleOK(param)}>
                  Take {take(state?.rondel?.pointingBefore!, state?.rondel?.peat!, state?.config!)} wood with{' '}
                  {symbols.wood}
                </button>
              ))
              .with(ResourceEnum.Joker, () => (
                <button key={param} className="primary" onClick={handleOK(param)}>
                  Take {take(state?.rondel?.pointingBefore!, state?.rondel?.joker!, state?.config!)} wood with{' '}
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
