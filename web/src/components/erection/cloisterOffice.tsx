import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { match } from 'ts-pattern'
import { map } from 'ramda'
import { ReactNode, useState } from 'react'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'
import { take } from '../rondel/values'
import { symbols } from '../rondel/rondel'

const ids = [
  BuildingEnum.CloisterOfficeR,
  BuildingEnum.CloisterOfficeG,
  BuildingEnum.CloisterOfficeB,
  BuildingEnum.CloisterOfficeW,
]

export const CloisterOffice = () => {
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
    <Modal title="Cloister Office" openModal={open} closeModal={handleCancel}>
      {map<string, ReactNode>((option) => {
        return match<string>(normalize(option))
          .with(normalize(''), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('')} style={{ float: 'right' }}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.coin!, state?.config!)} pennies with{' '}
              {symbols.coin}
            </button>
          ))
          .with(normalize('Jo'), () => (
            <button key={`${option}`} className="primary" onClick={sendPartial('Jo')} style={{ float: 'right' }}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.joker!, state?.config!)} pennies with{' '}
              {symbols.joker}
            </button>
          ))
          .otherwise(() => undefined)
      }, options)}
    </Modal>
  )
}
