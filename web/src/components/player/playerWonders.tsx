import { range } from 'ramda'

interface Props {
  wonders: number
}

export const PlayerWonders = ({ wonders }: Props) => (
  <div style={{ margin: 10 }}>
    {wonders > 0 && 'Wonders: '}
    {range(0, wonders).map((n) => (
      <span key={n}>🖼️</span>
    ))}
  </div>
)
