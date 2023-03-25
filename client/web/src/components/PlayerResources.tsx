import { range } from 'ramda'
import { ReactNode } from 'react'

interface TimesProps {
  n: number
  children: ReactNode | ReactNode[]
}
interface ResourceProps {
  id: string
}

const Times = ({ n, children }: TimesProps) => (
  <>
    {range(0, n).map((i) => (
      <span key={`${i}:${children}`}>{children}</span>
    ))}
  </>
)

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
    <Times n={peat}>
      <Resource id="Pt" />
    </Times>
    <Times n={penny}>
      <Resource id="Pn" />
    </Times>
    <Times n={clay}>
      <Resource id="Cl" />
    </Times>
    <Times n={wood}>
      <Resource id="Wo" />
    </Times>
    <Times n={grain}>
      <Resource id="Gn" />
    </Times>
    <Times n={sheep}>
      <Resource id="Sh" />
    </Times>
    <Times n={stone}>
      <Resource id="Sn" />
    </Times>
    <Times n={flour}>
      <Resource id="Fl" />
    </Times>
    <Times n={grape}>
      <Resource id="Gp" />
    </Times>
    <Times n={nickel}>
      <Resource id="Ni" />
    </Times>
    <Times n={malt}>
      <Resource id="Ho" />
    </Times>
    <Times n={coal}>
      <Resource id="Co" />
    </Times>
    <Times n={book}>
      <Resource id="Bo" />
    </Times>
    <Times n={ceramic}>
      <Resource id="Ce" />
    </Times>
    <Times n={whiskey}>
      <Resource id="Wh" />
    </Times>
    <Times n={straw}>
      <Resource id="Sw" />
    </Times>
    <Times n={meat}>
      <Resource id="Mt" />
    </Times>
    <Times n={ornament}>
      <Resource id="Or" />
    </Times>
    <Times n={bread}>
      <Resource id="Br" />
    </Times>
    <Times n={wine}>
      <Resource id="Wn" />
    </Times>
    <Times n={beer}>
      <Resource id="Be" />
    </Times>
    <Times n={reliquary}>
      <Resource id="Rq" />
    </Times>
  </div>
)
