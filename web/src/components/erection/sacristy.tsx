import { useInstanceContext } from '@/context/InstanceContext'
import { useState } from 'react'
import { Modal } from '../modal'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { includes, join, map, min, reduce, repeat } from 'ramda'
import { normalize, partiallyUsed } from './util'
import { ArrowRight } from 'lucide-react'
import { ItemRange } from '../itemRange'

const id = BuildingEnum.Sacristy

const multiplier = 0.75

export const Sacristy = () => {
  const { setPartial, addPartial, controls, currentPlayer } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const max = min(
    2,
    reduce(min<number>, currentPlayer?.book ?? 0, [
      currentPlayer?.ceramic ?? 0,
      currentPlayer?.ornament ?? 0,
      currentPlayer?.reliquary ?? 0,
    ])
  )
  const [times, setTimes] = useState(0)

  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const command = normalize(join('', repeat('BoCeOrRq', times)))

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const handleOK = () => {
    addPartial(command)
    setOpen(false)
  }

  return (
    <Modal title="Sacristy" closeModal={handleClose} openModal={open} close={'Cancel'}>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'right' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      <div style={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span>
          <ItemRange from={times} to={max} type={ResourceEnum.Book} onClick={() => setTimes(times + 1)} />
          <br />
          <ItemRange from={times} to={max} type={ResourceEnum.Ceramic} onClick={() => setTimes(times + 1)} />
          <br />
          <ItemRange from={times} to={max} type={ResourceEnum.Ornament} onClick={() => setTimes(times + 1)} />
          <br />
          <ItemRange from={times} to={max} type={ResourceEnum.Reliquary} onClick={() => setTimes(times + 1)} />
        </span>
        <ArrowRight />
        <button onClick={() => setTimes(times - 1)}>{repeat('🖼️', times)}</button>
      </div>
      <br />
      <button className="primary" onClick={handleOK} disabled={!includes(command, normOptions)}>
        OK
      </button>
    </Modal>
  )
}
