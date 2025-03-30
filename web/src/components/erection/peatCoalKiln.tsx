import { useInstanceContext } from '@/context/InstanceContext'
import { ChangeEventHandler, ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { map, range, repeat, reverse } from 'ramda'
import { partiallyUsed } from './util'

const id = BuildingEnum.PeatCoalKiln

const multiplier = 1

export const PeatCoalKiln = () => {
  const { setPartial, addPartial, controls, currentPlayer } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const maxPeat = currentPlayer?.peat ?? 0
  const [peatUsed, setPeatUsed] = useState(maxPeat)

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const handleOK = () => {
    const command = repeat('Pt', peatUsed).join('')
    addPartial(command)
    setOpen(false)
  }

  return (
    <Modal title="Peat Coal Kiln" closeModal={handleClose} openModal={open} close={'Cancel'}>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'left' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      <h2>Get</h2>
      +1 coal +1 coin
      <h4>Then</h4> turn{' '}
      <select value={peatUsed} onChange={(e) => setPeatUsed(Number.parseInt(e.currentTarget.value))}>
        {map<number, ReactNode>(
          (n) => (
            <option key={n}>{n}</option>
          ),
          range(0, maxPeat + 1)
        )}
      </select>{' '}
      peat into coal
      <button className="primary" onClick={handleOK}>
        OK
      </button>
    </Modal>
  )
}
