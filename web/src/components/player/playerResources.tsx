import Image from 'next/image'
import { range, repeat } from 'ramda'
import { useState } from 'react'
import { ResourceEnum } from 'hathora-et-labora-game/dist/types'

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
}

export const Resource = ({ type }: ResourceProps) => {
  return (
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
  )
}

interface TimesProps {
  n: number
  id: string
}
const Times = ({ n, id }: TimesProps) => {
  return (
    <>
      {range(0, n).map((i) => (
        <Resource key={`${i}:${id}`} type={id} />
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

  const resources = [
    repeat(ResourceEnum.Peat, peatUsed).join(''),
    repeat(ResourceEnum.Penny, pennyUsed).join(''),
    repeat(ResourceEnum.Grain, grainUsed).join(''),
    repeat(ResourceEnum.Clay, clayUsed).join(''),
    repeat(ResourceEnum.Wood, woodUsed).join(''),
    repeat(ResourceEnum.Sheep, sheepUsed).join(''),
    repeat(ResourceEnum.Stone, stoneUsed).join(''),
    repeat(ResourceEnum.Flour, flourUsed).join(''),
    repeat(ResourceEnum.Grape, grapeUsed).join(''),
    repeat(ResourceEnum.Nickel, nickelUsed).join(''),
    repeat(ResourceEnum.Malt, maltUsed).join(''),
    repeat(ResourceEnum.Coal, coalUsed).join(''),
    repeat(ResourceEnum.Book, bookUsed).join(''),
    repeat(ResourceEnum.Ceramic, ceramicUsed).join(''),
    repeat(ResourceEnum.Whiskey, whiskeyUsed).join(''),
    repeat(ResourceEnum.Straw, strawUsed).join(''),
    repeat(ResourceEnum.Meat, meatUsed).join(''),
    repeat(ResourceEnum.Ornament, ornamentUsed).join(''),
    repeat(ResourceEnum.Bread, breadUsed).join(''),
    repeat(ResourceEnum.Wine, wineUsed).join(''),
    repeat(ResourceEnum.Beer, beerUsed).join(''),
    repeat(ResourceEnum.Reliquary, reliquaryUsed).join(''),
  ].join('')

  return (
    <div style={{ margin: 10 }}>
      {/* Construction stuff */}
      <Times n={clay} id={ResourceEnum.Clay} />
      <Times n={wood} id={ResourceEnum.Wood} />
      <Times n={sheep} id={ResourceEnum.Sheep} />
      <Times n={straw} id={ResourceEnum.Straw} />
      <Times n={stone} id={ResourceEnum.Stone} />
      {/* Midgame, processed stuff */}
      <Times n={grain} id={ResourceEnum.Grain} />
      <Times n={malt} id={ResourceEnum.Malt} />
      <Times n={flour} id={ResourceEnum.Flour} />
      <Times n={grape} id={ResourceEnum.Grape} />
      <Times n={beer} id={ResourceEnum.Beer} />
      <Times n={meat} id={ResourceEnum.Meat} />
      <Times n={bread} id={ResourceEnum.Bread} />
      {/* Currency */}
      <Times n={wine} id={ResourceEnum.Wine} />
      <Times n={whiskey} id={ResourceEnum.Whiskey} />
      <Times n={penny} id={ResourceEnum.Penny} />
      <Times n={nickel} id={ResourceEnum.Nickel} />
      {/* Energy */}
      <Times n={peat} id={ResourceEnum.Peat} />
      <Times n={coal} id={ResourceEnum.Coal} />
      {/* Points */}
      <Times n={book} id={ResourceEnum.Book} />
      <Times n={ceramic} id={ResourceEnum.Ceramic} />
      <Times n={ornament} id={ResourceEnum.Ornament} />
      <Times n={reliquary} id={ResourceEnum.Reliquary} />
    </div>
  )
}
