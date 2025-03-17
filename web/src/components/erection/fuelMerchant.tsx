import { useInstanceContext } from '@/context/InstanceContext'
import { ChangeEvent, MouseEvent, MouseEventHandler, useEffect, useState } from 'react'
import { Modal } from '../modal'
import { partiallyUsed } from './util'
import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { range } from 'ramda'
import Image from 'next/image'
import { XIcon } from 'lucide-react'

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
            console.log('sxxxetParamContrib called with ', n, param)
            const newArr = [...usedArr.slice(0, n), param, ...usedArr.slice(n + 1)]
            setUsedArr(newArr)
            setComponent(newArr.join(''))
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

  const [clayUsed, setClayUsed] = useState('')
  const [peatUsed, setPeatUsed] = useState('')
  const [pennyUsed, setPennyUsed] = useState('')
  const [woodUsed, setWoodUsed] = useState('')
  const [grainUsed, setGrainUsed] = useState('')
  const [sheepUsed, setSheepUsed] = useState('')
  const [stoneUsed, setStoneUsed] = useState('')
  const [flourUsed, setFlourUsed] = useState('')
  const [grapeUsed, setGrapeUsed] = useState('')
  const [nickelUsed, setNickelUsed] = useState('')
  const [maltUsed, setMaltUsed] = useState('')
  const [coalUsed, setCoalUsed] = useState('')
  const [bookUsed, setBookUsed] = useState('')
  const [ceramicUsed, setCeramicUsed] = useState('')
  const [whiskeyUsed, setWhiskeyUsed] = useState('')
  const [strawUsed, setStrawUsed] = useState('')
  const [meatUsed, setMeatUsed] = useState('')
  const [ornamentUsed, setOrnamentUsed] = useState('')
  const [breadUsed, setBreadUsed] = useState('')
  const [wineUsed, setWineUsed] = useState('')
  const [beerUsed, setBeerUsed] = useState('')
  const [reliquaryUsed, setReliquaryUsed] = useState('')

  const allResources = `${clayUsed}${peatUsed}${pennyUsed}${grainUsed}${sheepUsed}${stoneUsed}${flourUsed}${grapeUsed}${nickelUsed}${maltUsed}${coalUsed}${woodUsed}${bookUsed}${ceramicUsed}${whiskeyUsed}${strawUsed}${meatUsed}${ornamentUsed}${breadUsed}${wineUsed}${beerUsed}${reliquaryUsed}`

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
    <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
      <button onClick={handleClose} style={{ float: 'right' }}>
        <XIcon />
      </button>
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
