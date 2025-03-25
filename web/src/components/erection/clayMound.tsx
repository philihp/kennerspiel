import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { match } from 'ts-pattern'
import { map } from 'ramda'
import { ReactNode, useState } from 'react'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'
import { take } from '../rondel/values'
import { symbols } from '../rondel/rondel'

const ids = [BuildingEnum.ClayMoundR, BuildingEnum.ClayMoundG, BuildingEnum.ClayMoundB, BuildingEnum.ClayMoundW]

export const ClayMound = () => {
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
    <Modal title="Clay Mound" openModal={open} closeModal={handleCancel}>
      {map<string, ReactNode>((option) => {
        return match<string>(normalize(option))
          .with(normalize('Cl'), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('Cl')} style={{ float: 'right' }}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.clay!, state?.config!)} clay with {symbols.clay}
            </button>
          ))
          .with(normalize('ClJo'), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('ClJo')} style={{ float: 'right' }}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.joker!, state?.config!)} clay with{' '}
              {symbols.joker}
            </button>
          ))
          .otherwise(() => undefined)
      }, options)}
    </Modal>
  )
}
