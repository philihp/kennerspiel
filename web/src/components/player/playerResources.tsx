import { useInstanceContext } from '@/context/InstanceContext'
import Image from 'next/image'
import { any, head, includes, invert, map, range, repeat } from 'ramda'
import { Dispatch, SetStateAction, useState } from 'react'
import { match } from 'ts-pattern'

interface Props {
  active: boolean
  peat: number
  penny: number
  clay: number
  wood: number
  grain: number
  sheep: number
  stone: number
  flour: number
  grape: number
  nickel: number
  malt: number
  coal: number
  book: number
  ceramic: number
  whiskey: number
  straw: number
  meat: number
  ornament: number
  bread: number
  wine: number
  beer: number
  reliquary: number
}

const multiplier = 1.5

interface ResourceProps {
  type: string
  active: boolean
  onIncrement?: () => void
  onDecrement?: () => void
}
export const Resource = ({ type, active, onIncrement, onDecrement }: ResourceProps) => {
  const { controls } = useInstanceContext()
  const [used, setUsed] = useState(false)

  const disabled = !active || !any(includes(type), controls?.completion ?? [])

  const handleClick = () => {
    used && setUsed(false)
    used && onDecrement?.()
    !used && setUsed(true)
    !used && onIncrement?.()
  }

  return (
    <>
      <button
        disabled={disabled}
        className={'primary'}
        style={used ? { background: 'linear-gradient( #007AFF, #2e93ff 50%)', opacity: 0.7 } : {}}
        onClick={handleClick}
      >
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
          }}
          src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${type}.jpg`}
          width={24 * multiplier}
          height={24 * multiplier}
        />
      </button>
    </>
  )
}

interface TimesProps {
  n: number
  id: string
  active: boolean
  onIncrement?: () => void
  onDecrement?: () => void
}
const Times = ({ n, id, active, onIncrement, onDecrement }: TimesProps) => {
  return (
    <>
      {range(0, n).map((i) => (
        <Resource key={`${i}:${id}`} type={id} active={active} onIncrement={onIncrement} onDecrement={onDecrement} />
      ))}
    </>
  )
}

export const PlayerResources = ({
  peat,
  penny,
  clay,
  wood,
  grain,
  sheep,
  stone,
  flour,
  grape,
  nickel,
  malt,
  coal,
  book,
  ceramic,
  whiskey,
  straw,
  meat,
  ornament,
  bread,
  wine,
  beer,
  reliquary,
  active,
}: Props) => {
  const { controls, addPartial } = useInstanceContext()

  const [clayUsed, setClayUsed] = useState(0)
  const [peatUsed, setPeatUsed] = useState(0)
  const [pennyUsed, setPennyUsed] = useState(0)
  const [woodUsed, setWoodUsed] = useState(0)
  const [grainUsed, setGrainUsed] = useState(0)
  const [sheepUsed, setSheepUsed] = useState(0)
  const [stoneUsed, setStoneUsed] = useState(0)
  const [flourUsed, setFlourUsed] = useState(0)
  const [grapeUsed, setGrapeUsed] = useState(0)
  const [nickelUsed, setNickelUsed] = useState(0)
  const [maltUsed, setMaltUsed] = useState(0)
  const [coalUsed, setCoalUsed] = useState(0)
  const [bookUsed, setBookUsed] = useState(0)
  const [ceramicUsed, setCeramicUsed] = useState(0)
  const [whiskeyUsed, setWhiskeyUsed] = useState(0)
  const [strawUsed, setStrawUsed] = useState(0)
  const [meatUsed, setMeatUsed] = useState(0)
  const [ornamentUsed, setOrnamentUsed] = useState(0)
  const [breadUsed, setBreadUsed] = useState(0)
  const [wineUsed, setWineUsed] = useState(0)
  const [beerUsed, setBeerUsed] = useState(0)
  const [reliquaryUsed, setReliquaryUsed] = useState(0)

  const resources = [repeat('Cl', clayUsed).join(''), repeat('Pt', peatUsed).join('')].join('')

  const handleSend = () => {
    addPartial(resources)
  }

  return (
    <div style={{ margin: 10 }}>
      <br />
      {/* Construction stuff */}
      <Times
        active={active}
        n={clay}
        id="Cl"
        onIncrement={() => setClayUsed(clayUsed + 1)}
        onDecrement={() => setClayUsed(clayUsed - 1)}
      />
      <Times
        active={active}
        n={wood}
        id="Wo"
        onIncrement={() => setWoodUsed(woodUsed + 1)}
        onDecrement={() => setWoodUsed(woodUsed - 1)}
      />
      <Times
        active={active}
        n={sheep}
        id="Sh"
        onIncrement={() => setSheepUsed(sheepUsed + 1)}
        onDecrement={() => setSheepUsed(sheepUsed - 1)}
      />
      <Times
        active={active}
        n={straw}
        id="Sw"
        onIncrement={() => setStrawUsed(strawUsed + 1)}
        onDecrement={() => setStrawUsed(strawUsed - 1)}
      />
      <Times
        active={active}
        n={stone}
        id="Sn"
        onIncrement={() => setStoneUsed(stoneUsed + 1)}
        onDecrement={() => setStoneUsed(stoneUsed - 1)}
      />

      {/* Midgame, processed stuff */}
      <Times
        active={active}
        n={grain}
        id="Gn"
        onIncrement={() => setGrainUsed(grainUsed + 1)}
        onDecrement={() => setGrainUsed(grainUsed - 1)}
      />
      <Times
        active={active}
        n={malt}
        id="Ho"
        onIncrement={() => setMaltUsed(maltUsed + 1)}
        onDecrement={() => setMaltUsed(maltUsed - 1)}
      />
      <Times
        active={active}
        n={flour}
        id="Fl"
        onIncrement={() => setFlourUsed(flourUsed + 1)}
        onDecrement={() => setFlourUsed(flourUsed - 1)}
      />
      <Times
        active={active}
        n={grape}
        id="Gp"
        onIncrement={() => setGrapeUsed(grapeUsed + 1)}
        onDecrement={() => setGrapeUsed(grapeUsed - 1)}
      />
      <Times
        active={active}
        n={beer}
        id="Be"
        onIncrement={() => setBeerUsed(beerUsed + 1)}
        onDecrement={() => setBeerUsed(beerUsed - 1)}
      />
      <Times
        active={active}
        n={meat}
        id="Mt"
        onIncrement={() => setMeatUsed(meatUsed + 1)}
        onDecrement={() => setMeatUsed(meatUsed - 1)}
      />
      <Times
        active={active}
        n={bread}
        id="Br"
        onIncrement={() => setBreadUsed(breadUsed + 1)}
        onDecrement={() => setBreadUsed(breadUsed - 1)}
      />

      {/* Currency */}
      <Times
        active={active}
        n={wine}
        id="Wn"
        onIncrement={() => setWineUsed(wineUsed + 1)}
        onDecrement={() => setWineUsed(wineUsed - 1)}
      />
      <Times
        active={active}
        n={whiskey}
        id="Wh"
        onIncrement={() => setWhiskeyUsed(whiskeyUsed + 1)}
        onDecrement={() => setWhiskeyUsed(whiskeyUsed - 1)}
      />
      <Times
        active={active}
        n={penny}
        id="Pn"
        onIncrement={() => setPennyUsed(pennyUsed + 1)}
        onDecrement={() => setPennyUsed(pennyUsed - 1)}
      />
      <Times
        active={active}
        n={nickel}
        id="Ni"
        onIncrement={() => setNickelUsed(nickelUsed + 1)}
        onDecrement={() => setNickelUsed(nickelUsed - 1)}
      />

      {/* Energy */}
      <Times
        active={active}
        n={peat}
        id="Pt"
        onIncrement={() => setPeatUsed(peatUsed + 1)}
        onDecrement={() => setPeatUsed(peatUsed - 1)}
      />
      <Times
        active={active}
        n={coal}
        id="Co"
        onIncrement={() => setCoalUsed(coalUsed + 1)}
        onDecrement={() => setCoalUsed(coalUsed - 1)}
      />

      {/* Points */}
      <Times
        active={active}
        n={book}
        id="Bo"
        onIncrement={() => setBookUsed(bookUsed + 1)}
        onDecrement={() => setBookUsed(bookUsed - 1)}
      />
      <Times
        active={active}
        n={ceramic}
        id="Ce"
        onIncrement={() => setCeramicUsed(ceramicUsed + 1)}
        onDecrement={() => setCeramicUsed(ceramicUsed - 1)}
      />
      <Times
        active={active}
        n={ornament}
        id="Or"
        onIncrement={() => setOrnamentUsed(ornamentUsed + 1)}
        onDecrement={() => setOrnamentUsed(ornamentUsed - 1)}
      />
      <Times
        active={active}
        n={reliquary}
        id="Rq"
        onIncrement={() => setReliquaryUsed(reliquaryUsed + 1)}
        onDecrement={() => setReliquaryUsed(reliquaryUsed - 1)}
      />

      <button className="primary" onClick={handleSend} disabled={!(controls?.completion ?? []).includes(resources)}>
        Send
      </button>
    </div>
  )
}
