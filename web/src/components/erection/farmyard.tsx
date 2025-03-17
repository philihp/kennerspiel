import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { match } from 'ts-pattern'
import { map } from 'ramda'
import { useState } from 'react'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { partiallyUsed } from './util'

const ids = [BuildingEnum.FarmYardR, BuildingEnum.FarmYardG, BuildingEnum.FarmYardB, BuildingEnum.FarmYardW]

export const Farmyard = () => {
  const { state, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed(ids, controls?.partial))

  const sendPartial = (type: 'Sh' | 'Gn') => () => {
    addPartial(type)
    setOpen(false)
  }

  const button = (completion: string) =>
    match(completion)
      .with('Sh', () => (
        <li key={completion}>
          <button className="primary" onClick={sendPartial('Sh')}>
            Sheep
          </button>
        </li>
      ))
      .with('Gn', () => (
        <li key={completion}>
          <button className="primary" onClick={sendPartial('Gn')}>
            Grain
          </button>
        </li>
      ))
      .otherwise(() => undefined)

  const options = controls?.completion ?? []

  return (
    <Modal title="Use Farmyard" openModal={open}>
      Sending your clergy to the farmyard to collect: options
      <ul>{map(button)(options)}</ul>
    </Modal>
  )
}
