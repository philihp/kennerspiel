import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { equals, findIndex, flatten, includes, join, map, max, min, range, repeat } from 'ramda'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'
import { ItemList } from '../itemList'

import { ChevronsRight } from 'lucide-react'

const id = BuildingEnum.CloisterLibrary

export const CloisterLibrary = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const [pennyUsed, setPennyUsed] = useState(0)
  const [bookUsed, setBookUsed] = useState(0)

  const command = normalize(
    join('', flatten([repeat(ResourceEnum.Penny, pennyUsed), repeat(ResourceEnum.Book, bookUsed)]))
  )

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const sendPartial = () => {
    const i = findIndex(equals(command), normOptions)
    addPartial(options[i])
    setOpen(false)
  }

  return (
    <Modal title="CloisterLibrary" openModal={open} closeModal={handleClose}>
      Convert into books
      <br />
      {map(
        (n) => (
          <ItemList key={n} items="Pn" onClick={() => setPennyUsed(min(pennyUsed + 1, player?.penny ?? 0))} />
        ),
        range(0, min(3, player?.penny ?? 0) - pennyUsed)
      )}
      <ChevronsRight />
      {map(
        (n) => (
          <ItemList key={n} items="Pn" onClick={() => setPennyUsed(max(0, pennyUsed - 1))} />
        ),
        range(0, pennyUsed)
      )}
      <br />
      and then sell for wine and meat
      <br />
      {map(
        (n) => (
          <ItemList key={n} items="Bo" onClick={() => setBookUsed(1)} />
        ),
        range(0, min(1, max(pennyUsed, player?.book ?? 0)) - bookUsed)
      )}
      <ChevronsRight />
      {map(
        (n) => (
          <ItemList key={n} items="Bo" onClick={() => setBookUsed(0)} />
        ),
        range(0, bookUsed)
      )}
      <hr />
      <div style={{ float: 'right' }}>
        <button className="primary" disabled={!includes(command, normOptions) || command !== ''} onClick={sendPartial}>
          Skip
        </button>
        <button className="primary" disabled={!includes(command, normOptions) || command === ''} onClick={sendPartial}>
          Use
        </button>
      </div>
    </Modal>
  )
}
