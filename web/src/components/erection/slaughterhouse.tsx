import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { includes, join, map, min, range, repeat } from 'ramda'
import { normalize, partiallyUsed } from './util'
import { ItemList } from '../itemList'
import { ArrowRight } from 'lucide-react'

const id = BuildingEnum.Slaughterhouse

const multiplier = 1

export const Slaughterhouse = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const max = min(state?.players?.[0]?.sheep ?? 0, state?.players?.[0]?.straw ?? 0)
  const [peatUsed, setPeatUsed] = useState(max)

  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const command = normalize(join('', repeat('SwSh', peatUsed)))

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const handleOK = () => {
    addPartial(command)
    setOpen(false)
  }

  return (
    <Modal title="Slaughterhouse" closeModal={handleClose} openModal={open} close={'Cancel'}>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'left' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      Turn{' '}
      <select value={peatUsed} onChange={(e) => setPeatUsed(Number.parseInt(e.currentTarget.value))}>
        {map<number, ReactNode>(
          (n) => (
            <option key={n}>{n}</option>
          ),
          range(0, max + 1)
        )}
      </select>{' '}
      <ItemList items="SwSh" />
      <ArrowRight />
      <ItemList items="Mt" />
      <br />
      <button className="primary" onClick={handleOK} disabled={!includes(command, normOptions)}>
        OK
      </button>
    </Modal>
  )
}
