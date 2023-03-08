interface Props {
  settlements: string[]
}

export const PlayerSettlements = ({ settlements }: Props) => (
  <div style={{ margin: 10 }}>
    Unbuilt Settlements:
    {settlements.map((settlement) => (
      <span style={{ padding: 3, margin: 3, border: '1px solid #DDD' }} key={settlement}>
        {settlement}
      </span>
    ))}
  </div>
)
