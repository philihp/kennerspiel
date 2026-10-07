import { useInstanceContext } from '@/context/InstanceContext'
import { Trophy } from 'lucide-react'
import { map, sum } from 'ramda'
import { PlayerDot } from './playerDot'
import { rankScores, Ranked } from './endGame'

const cell = { padding: '2px 10px', textAlign: 'right' as const }

// Final standings, shown once the game is over. The scores come from the
// engine's control(), which the context computes for every state.
export const Scoreboard = () => {
  const { state, controls } = useInstanceContext()
  if (state === undefined || controls === undefined) return <></>

  const ranked = rankScores(state.players, controls.score)

  return (
    <div
      style={{
        display: 'inline-block',
        backgroundColor: 'rgba(179, 222, 105, 0.19)',
        border: '1px solid rgba(135, 167, 79, 0.49)',
        borderRadius: 16,
        padding: '8px 16px',
        marginBottom: 8,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Game over</h2>
      <table>
        <thead>
          <tr>
            <th style={{ ...cell, textAlign: 'left' }}>Player</th>
            <th style={cell}>Goods</th>
            <th style={cell}>Buildings</th>
            <th style={cell}>Settlements</th>
            <th style={cell}>Total</th>
          </tr>
        </thead>
        <tbody>
          {map(
            ({ player, score, rank }: Ranked) => (
              <tr key={player.color} style={{ fontWeight: rank === 1 ? 'bold' : 'normal' }}>
                <td style={{ ...cell, textAlign: 'left' }}>
                  <PlayerDot color={player.color} /> {player.color}{' '}
                  {rank === 1 && <Trophy size={14} style={{ verticalAlign: 'middle' }} />}
                </td>
                <td style={cell}>{score.goods}</td>
                <td style={cell}>{score.economic}</td>
                <td style={cell}>{sum(score.settlements)}</td>
                <td style={cell}>{score.total}</td>
              </tr>
            ),
            ranked
          )}
        </tbody>
      </table>
    </div>
  )
}
