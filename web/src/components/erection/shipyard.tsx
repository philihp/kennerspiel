import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { useState } from 'react'
import { partiallyUsed } from './util'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { map } from 'ramda'
import { ItemList } from '../itemList'
import { match } from 'ts-pattern'
import Image from 'next/image'

const multiplier = 0.75
const id = BuildingEnum.Shipyard

export const Shipyard = () => {
  const { controls, setPartial, addPartial } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const completion = controls?.completion ?? []

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  return (
    <Modal title="Shipyard" openModal={open} closeModal={handleClose}>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'left' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      Convert 2 wood into
      <ItemList items={'OrNi'} />
      <hr />
      {map(
        (option) => (
          <button key={option} className="primary" onClick={handleOK(option)}>
            {match(option)
              .with('', () => (
                <div>
                  <i>Skip</i>
                </div>
              ))
              .otherwise(() => (
                <>
                  Pay with <ItemList items={option} />
                </>
              ))}
          </button>
        ),
        completion
      )}
    </Modal>
  )
}
