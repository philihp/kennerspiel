import { Erection } from './Erection'

interface Props {
  settlements: string[]
}

export const PlayerSettlements = ({ settlements }: Props) => (
  <div style={{ margin: 10 }}>
    {settlements.map((settlement) => (
      <Erection id={settlement} />
    ))}
  </div>
)
