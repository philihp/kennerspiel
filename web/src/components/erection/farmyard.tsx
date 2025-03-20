import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { match } from 'ts-pattern'
import { join, map, repeat } from 'ramda'
import { ReactNode, useState } from 'react'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'
import { ItemList } from '../itemList'
import { take } from '../rondel/values'

const ids = [BuildingEnum.FarmYardR, BuildingEnum.FarmYardG, BuildingEnum.FarmYardB, BuildingEnum.FarmYardW]

export const Farmyard = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed(ids, controls?.partial))

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
    <Modal title="Farmyard" openModal={open} closeModal={handleCancel}>
      {map<string, ReactNode>((option) => {
        return match<string>(normalize(option))
          .with(normalize('Sh'), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('Sh')}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.sheep!, state?.config!)} sheep with 🐑
            </button>
          ))
          .with(normalize('Gn'), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('Gn')}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.grain!, state?.config!)} grain with 🌾
            </button>
          ))
          .with(normalize('ShJo'), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('ShJo')}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.joker!, state?.config!)} sheep with 🃏
            </button>
          ))
          .with(normalize('GnJo'), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('GnJo')}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.joker!, state?.config!)} grain with 🃏
            </button>
          ))
          .otherwise(() => undefined)
      }, options)}
    </Modal>
  )
}
