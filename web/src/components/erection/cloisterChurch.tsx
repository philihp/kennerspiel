import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { includes, join, map, min, range, repeat } from 'ramda'
import { normalize, partiallyUsed } from './util'
import { ItemList } from '../itemList'
import { ArrowRight } from 'lucide-react'
import { ItemRange } from '../itemRange'

const id = BuildingEnum.CloisterChurch

const multiplier = 1

export const CloisterChurch = () => {
  const { currentPlayer, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const max = min(2, min(currentPlayer?.bread ?? 0, currentPlayer?.wine ?? 0))
  const [times, setTimes] = useState(0)

  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const command = normalize(join('', repeat('BrWn', times)))

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const handleOK = () => {
    addPartial(command)
    setOpen(false)
  }

  return (
    <Modal title="Cloister Church" closeModal={handleClose} openModal={open} close={'Cancel'}>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'left' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      <div style={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span>
          <ItemRange from={times} to={max} type={ResourceEnum.Bread} onClick={() => setTimes(times + 1)} />
          <br />
          <ItemRange from={times} to={max} type={ResourceEnum.Wine} onClick={() => setTimes(times + 1)} />
        </span>
        <ArrowRight />
        <ItemRange from={0} to={times} type={ResourceEnum.Reliquary} onClick={() => setTimes(times - 1)} />
      </div>
      <br />
      <button className="primary" onClick={handleOK} disabled={!includes(command, normOptions)}>
        OK
      </button>
    </Modal>
  )
}
