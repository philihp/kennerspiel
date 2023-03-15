import { range } from 'ramda'
import { ReactNode } from 'react'

interface TimesProps {
  n: number
  children: ReactNode | ReactNode[]
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
    Resources:
    <Times n={peat}>Pt</Times>
    <Times n={penny}>Pn</Times>
    <Times n={clay}>Cl</Times>
    <Times n={wood}>Wo</Times>
    <Times n={grain}>Gn</Times>
    <Times n={sheep}>Sh</Times>
    <Times n={stone}>Sn</Times>
    <Times n={flour}>Fl</Times>
    <Times n={grape}>Gp</Times>
    <Times n={nickel}>Ni</Times>
    <Times n={malt}>Ho</Times>
    <Times n={coal}>Co</Times>
    <Times n={book}>Bo</Times>
    <Times n={ceramic}>Ce</Times>
    <Times n={whiskey}>Wh</Times>
    <Times n={straw}>Sw</Times>
    <Times n={meat}>Mt</Times>
    <Times n={ornament}>Or</Times>
    <Times n={bread}>Br</Times>
    <Times n={wine}>Wn</Times>
    <Times n={beer}>Be</Times>
    <Times n={reliquary}>Rq</Times>
  </div>
)
