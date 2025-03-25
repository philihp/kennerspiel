import { useInstanceContext } from '@/context/InstanceContext'
import { MouseEvent, useEffect, useState } from 'react'
import { Modal } from '../modal'
import { partiallyUsed } from './util'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { range } from 'ramda'
import Image from 'next/image'

const id = BuildingEnum.FuelMerchant

const multiplier = 1.5

interface ResourceProps {
  type: string
  n: number
  setParam: (n: number, param: string) => void
}

export const Resource = ({ type, n, setParam }: ResourceProps) => {
  const [used, setUsed] = useState(false)
  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setUsed(e.target.checked)
  //   setParam(n, !used ? type : '')
  // }

  const handleClick = (e: MouseEvent<HTMLImageElement>) => {
    setUsed(!used)
    setParam(n, !used ? type : '')
  }

  return (
    <>
      <Image
        alt={type}
        title={type}
        style={{
          display: 'inline',
          margin: 0.5,
          borderWidth: 0.5,
          borderRadius: 4,
          borderColor: '#000',
          borderStyle: 'solid',
          opacity: used ? 0.5 : 1,
        }}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${type}.jpg`}
        width={24 * multiplier}
        height={24 * multiplier}
        onClick={handleClick}
      />
    </>
  )
}

interface TimesProps {
  n: number
  id: string
  setComponent: (param: string) => void
}
const Times = ({ n, id, setComponent }: TimesProps) => {
  const [usedArr, setUsedArr] = useState<string[]>([])
  return (
    <>
      {range(0, n).map((i) => (
        <Resource
          key={`${i}:${id}`}
          n={i}
          type={id}
          setParam={(n: number, param: string) => {
            if (param === '') {
              const newArr = [...usedArr.slice(0, usedArr.length - 1)]
              setUsedArr(newArr)
              setComponent(newArr.join(''))
            } else {
              const newArr = [...usedArr, param]
              setUsedArr(newArr)
              setComponent(newArr.join(''))
            }
          }}
        />
      ))}
      <br />
    </>
  )
}

interface InventoryProps {
  allowed: string
  setParam: (param: string) => void
}

const Inventory = ({ allowed, setParam }: InventoryProps) => {
  const { state, addPartial, setPartial, controls } = useInstanceContext()
  const player = state?.players[state?.frame?.currentPlayerIndex]

  const [peatUsed, setPeatUsed] = useState('')
  const [woodUsed, setWoodUsed] = useState('')
  const [coalUsed, setCoalUsed] = useState('')
  const [strawUsed, setStrawUsed] = useState('')

  const allResources = `${peatUsed}${coalUsed}${woodUsed}${strawUsed}`

  useEffect(() => {
    setParam(allResources)
  }, [setParam, allResources])

  if (player === undefined) return
  const { wood, straw, peat, coal } = player

  return (
    <>
      <Times
        n={coal}
        id="Co"
        setComponent={(s: string) => {
          console.log('setCoalUsed', s)
          setCoalUsed(s)
        }}
      />
      <Times
        n={wood}
        id="Wo"
        setComponent={(s: string) => {
          console.log('setWoodUsed', s)
          setWoodUsed(s)
        }}
      />
      <Times n={straw} id="Sw" setComponent={setStrawUsed} />
      <Times n={peat} id="Pt" setComponent={setPeatUsed} />
    </>
  )
}

export const FuelMerchant = () => {
  const { addPartial, setPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([BuildingEnum.FuelMerchant], controls?.partial))

  const [param, setParam] = useState('')

  const handleOK = () => {
    addPartial(param)
    setOpen(false)
  }

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const invalid = !(controls?.completion ?? []).includes(param)

  return (
    <Modal title="Fuel Merchant" closeModal={handleClose} openModal={open} close={'Cancel'}>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'left' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      Turn 3/6/9 fuel into 5/8/10 coins.
      <hr />
      <Inventory allowed={'WoSwPtCo'} setParam={setParam} />
      <hr />
      <div style={{ float: 'right' }}>
        {param}
        <button disabled={invalid || param.length !== 0} className="primary" onClick={handleOK}>
          None
        </button>
        <button disabled={invalid || param.length === 0} className="primary" onClick={handleOK}>
          Convert
        </button>
      </div>
    </Modal>
  )
}
