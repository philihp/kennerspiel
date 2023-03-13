import { Erection } from './Erection'

interface Props {
  buildings: string[]
}

export const UnbuiltBuildings = ({ buildings }: Props) => (
  <div style={{ margin: 10 }}>
    Unbuilt Buildings:
    {buildings.map((building) => (
      // <span style={{ padding: 3, margin: 3, border: '1px solid #DDD' }} key={building}>
      <Erection key={building} id={building} />
      // </span>
    ))}
  </div>
)
