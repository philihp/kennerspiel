import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { useState } from 'react'
import { partiallyUsed } from './util'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { map } from 'ramda'
import { ItemList } from '../itemList'
import { match } from 'ts-pattern'

const id = BuildingEnum.BuildersMarket

export const BuildersMarket = () => {
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
    <Modal title="Builders' Market" openModal={open} closeModal={handleClose}>
      Pay 2 coins for 2 wood, 2 clay, 1 stone, 1 straw
      {map(
        (option) => (
          <button className="primary" onClick={handleOK(option)}>
            {match(option)
              .with('', () => (
                <div>
                  <i>Skip</i>
                </div>
              ))
              .otherwise(() => (
                <ItemList items={option} />
              ))}
          </button>
        ),
        completion
      )}
    </Modal>
  )
}
