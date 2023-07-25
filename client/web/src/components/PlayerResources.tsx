import { range } from 'ramda'

interface Props {
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

const multiplier = 1.1

interface ResourceProps {
  id: string
}
export const Resource = ({ id }: ResourceProps) => (
  <img
    alt={id}
    title={id}
    style={{
      display: 'inline',
      margin: 0.5,
      borderWidth: 0.5,
      borderRadius: 4,
      borderColor: '#000',
      borderStyle: 'solid',
    }}
    src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
    width={24 * multiplier}
    height={24 * multiplier}
  />
)

interface TimesProps {
  n: number
  id: string
}
const Times = ({ n, id }: TimesProps) => (
  <>
    {range(0, n).map((i) => (
      <Resource key={`${i}:${id}`} id={id} />
    ))}
  </>
)

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
}: Props) => (
  <div style={{ margin: 10 }}>
    <Times n={peat} id="Pt" />
    <Times n={penny} id="Pn" />
    <Times n={clay} id="Cl" />
    <Times n={wood} id="Wo" />
    <Times n={grain} id="Gn" />
    <Times n={sheep} id="Sh" />
    <Times n={stone} id="Sn" />
    <Times n={flour} id="Fl" />
    <Times n={grape} id="Gp" />
    <Times n={nickel} id="Ni" />
    <Times n={malt} id="Ho" />
    <Times n={coal} id="Co" />
    <Times n={book} id="Bo" />
    <Times n={ceramic} id="Ce" />
    <Times n={whiskey} id="Wh" />
    <Times n={straw} id="Sw" />
    <Times n={meat} id="Mt" />
    <Times n={ornament} id="Or" />
    <Times n={bread} id="Br" />
    <Times n={wine} id="Wn" />
    <Times n={beer} id="Be" />
    <Times n={reliquary} id="Rq" />
  </div>
)
