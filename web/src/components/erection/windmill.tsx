import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { match, P } from 'ts-pattern'
import { map } from 'ramda'
import { useState } from 'react'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { partiallyUsed } from './util'
import { ItemList } from '../itemList'

import classes from './index.module.css'

const id = BuildingEnum.Windmill

export const Windmill = () => {
  const { addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))

  const sendPartial = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  const button = (completion: string) =>
    match(completion)
      .with('', () => (
        <li key={completion}>
          <button className="primary" onClick={sendPartial('')}>
            <i>Skip</i>
          </button>
        </li>
      ))
      .with(P.any, (param) => (
        <li key={completion}>
          <button className="primary" onClick={sendPartial(param)}>
            <ItemList items={param} />
          </button>
        </li>
      ))
      .otherwise(() => undefined)

  const options = controls?.completion ?? []

  return (
    <Modal title="Use Windmill" openModal={open}>
      <ul className={classes.modal}>{map(button)(options)}</ul>
    </Modal>
  )
}
