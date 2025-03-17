import { useInstanceContext } from '@/context/InstanceContext'
import { ChangeEventHandler, ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { map, range, repeat, reverse } from 'ramda'
import { partiallyUsed } from '../erection/util'
import { ItemList } from '../itemList'
import { match, P } from 'ts-pattern'

const multiplier = 1

export const ModalBuyPlot = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const [open, setOpen] = useState(partial[0] === 'BUY_PLOT' && partial[2] === undefined)

  const options = controls?.completion ?? []

  const handleClose = () => {
    setPartial([])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
  }

  return match(partial)
    .with(['BUY_PLOT'], () => (
      <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
        <h1>Buy Plot</h1>
        Which Row?
        <ul>
          {map<string, ReactNode>(
            (param) => (
              <li key={param}>
                <button className="primary" onClick={handleOK(param)}>
                  {param}
                </button>
              </li>
            ),
            options
          )}
        </ul>
      </Modal>
    ))
    .with(['BUY_PLOT', P.string], () => (
      <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
        <h1>Buy Plot</h1>
        Coast or Mountain?
        <ul>
          {map<string, ReactNode>(
            (param) => (
              <li key={param}>
                <button className="primary" onClick={handleOK(param)}>
                  {param}
                </button>
              </li>
            ),
            options
          )}
        </ul>
      </Modal>
    ))
    .otherwise(() => <></>)
}
