import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { match } from 'ts-pattern'
import { map } from 'ramda'
import { ReactNode, useState } from 'react'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'
import { take } from '../rondel/values'
import { symbols } from '../rondel/rondel'
import { ItemList } from '../itemList'

const id = BuildingEnum.Palace

export const Palace = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))

  const sendPartial = (type: string) => () => {
    addPartial(type)
    setOpen(false)
  }
  const handleCancel = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const options = controls?.completion ?? []

  return (
    <Modal title="Palace" openModal={open} closeModal={handleCancel}>
      Consume a wine to use any occupied building
      {map<string, ReactNode>((option) => {
        return match<string>(normalize(option))
          .with(normalize(''), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('')} style={{ float: 'right' }}>
              <i>Skip</i>
            </button>
          ))
          .with(normalize('Wn'), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('Wn')} style={{ float: 'right' }}>
              <ItemList items="Wn" />
            </button>
          ))
          .otherwise(() => undefined)
      }, options)}
    </Modal>
  )
}
