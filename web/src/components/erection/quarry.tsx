import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { map } from 'ramda'
import { ReactNode, useState } from 'react'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { partiallyUsed } from './util'
import { take } from '../rondel/values'
import { symbols } from '../rondel/rondel'

const ids = [BuildingEnum.QuarryA, BuildingEnum.QuarryB]

export const Quarry = () => {
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
    <Modal title="Quarry" openModal={open} closeModal={handleCancel}>
      {map<string, ReactNode>((option) => {
        if (option === '' && state?.rondel?.stone !== undefined)
          return (
            <button key={`${option}`} className="primary" onClick={sendPartial(option)} style={{ float: 'right' }}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.stone!, state?.config!)} stone with{' '}
              {symbols.stone}
            </button>
          )
        else if (
          (option === '' && state?.rondel?.stone === undefined && state?.rondel?.joker !== undefined) ||
          (option === 'Jo' && state?.rondel?.joker !== undefined)
        )
          return (
            <button key={`${option}`} className="primary" onClick={sendPartial(option)} style={{ float: 'right' }}>
              Take {take(state?.rondel?.pointingBefore!, state?.rondel?.joker!, state?.config!)} stone with{' '}
              {symbols.joker}
            </button>
          )
      }, options)}
    </Modal>
  )
}
