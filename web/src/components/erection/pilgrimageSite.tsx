import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { equals, findIndex, map } from 'ramda'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'

import { match, P } from 'ts-pattern'
import { ItemList } from '../itemList'

const id = BuildingEnum.PilgrimageSite

interface OptionProps {
  option: string
  primary: boolean
  handleOption: () => void
}

const Option = ({ option, primary, handleOption }: OptionProps) =>
  match<{ option: string }>({ option })
    .with({ option: P.union(ResourceEnum.Ceramic, ResourceEnum.Book, ResourceEnum.Ornament) }, () => (
      <button className={primary ? 'primary' : ''}>
        <ItemList items={option} onClick={handleOption} />
      </button>
    ))
    .with({ option: '' }, () => (
      // which way of doing primary do i like more?
      <button className={`${primary && 'primary'}`} onClick={handleOption}>
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
          <Option primary={partial.length === 2} key={option} option={option} handleOption={sendPartial(option)} />
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
              <Option primary={true} key={option} option={option} handleOption={sendPartial(option)} />
            ),
            normOptions
          )}
        </>
      )}
      <br />
    </Modal>
  )
}
