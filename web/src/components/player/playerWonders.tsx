import { range } from 'ramda'

interface Props {
  wonders: number
}

export const PlayerWonders = ({ wonders }: Props) => (
  <div style={{ margin: 10 }}>
    {range(0, wonders).map((n) => (
      <span key={n}>🖼️</span>
    ))}
  </div>
)
