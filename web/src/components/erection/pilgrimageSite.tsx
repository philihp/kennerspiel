import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { always, equals, findIndex, flatten, includes, join, map, max, min, range, repeat } from 'ramda'
import { JSX, useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'

import { ChevronsRight } from 'lucide-react'
import { ItemRange } from '../itemRange'
import { match, P } from 'ts-pattern'
import { ItemList } from '../itemList'

const id = BuildingEnum.PilgrimageSite

interface OptionProps {
  option: string
  handleOption: () => void
}

const Option = ({ option, handleOption }: OptionProps): JSX.Element =>
  match(option)
    .with(P.union(ResourceEnum.Ceramic, ResourceEnum.Book, ResourceEnum.Ornament), () => (
      <button className="primary">
        <ItemList items={option} onClick={handleOption} />
      </button>
    ))
    .with('', () => (
      <button className="primary" onClick={handleOption}>
        <i>Done</i>
      </button>
    ))
    .otherwise(() => <></>)

export const PilgrimageSite = () => {
  const { state, partial, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const sendPartial = (command: string) => () => {
    const i = findIndex(equals(command), normOptions)
    if (partial.length >= 3) setOpen(false)
    addPartial(options[i])
  }

  return (
    <Modal title="Pilgrimage Site" openModal={open} closeModal={handleClose}>
      First upgrade
      <br />
      {map(
        (option) => (
          <Option option={option} handleOption={sendPartial(option)} />
        ),
        normOptions
      )}
      <br />
      {partial.length >= 3 && (
        <>
          then upgrade
          <br />
          {map(
            (option) => (
              <Option option={option} handleOption={sendPartial(option)} />
            ),
            normOptions
          )}
        </>
      )}
      <br />
      {JSON.stringify(normOptions)}
    </Modal>
  )
}
