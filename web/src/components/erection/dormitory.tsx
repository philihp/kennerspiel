import { useInstanceContext } from '@/context/InstanceContext'
import { useState } from 'react'
import { Modal } from '../modal'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { includes, join, map, min, repeat } from 'ramda'
import { normalize, partiallyUsed } from './util'
import { ArrowRight } from 'lucide-react'
import { ItemRange } from '../itemRange'
import { ItemList } from '../itemList'

const id = BuildingEnum.Dormitory

const multiplier = 1

export const Dormitory = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(true)
  const max = min(state?.players?.[0]?.bread ?? 0, state?.players?.[0]?.wine ?? 0)
  const [times, setTimes] = useState(0)

  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const command = normalize(join('', repeat('SwWo', times)))

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const handleOK = () => {
    addPartial(command)
    setOpen(false)
  }

  return (
    <>
      <Modal title="Dormitory" closeModal={handleClose} openModal={open} close={'Cancel'}>
        <Image
          alt={id}
          src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
          style={{ float: 'left' }}
          width={150 * multiplier}
          height={250 * multiplier}
        />
        <div style={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          +1 <ItemList items={ResourceEnum.Ceramic} />
          <span>
            <ItemRange from={times} to={max} type={ResourceEnum.Straw} onClick={() => setTimes(times + 1)} />
            <br />
            <ItemRange from={times} to={max} type={ResourceEnum.Wood} onClick={() => setTimes(times + 1)} />
          </span>
          <ArrowRight />
          <ItemRange from={0} to={times} type={ResourceEnum.Book} onClick={() => setTimes(times - 1)} />
        </div>
        <br />
        <button className="primary" onClick={handleOK} disabled={!includes(command, normOptions)}>
          OK
        </button>
      </Modal>
    </>
  )
}
