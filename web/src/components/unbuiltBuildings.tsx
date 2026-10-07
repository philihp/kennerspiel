import { useInstanceContext } from '@/context/InstanceContext'
import { head, map } from 'ramda'
import { Erection } from './erection'
import { endGamePhase, EndGamePhase } from './endGame'

const roundOrTurn = (length?: string) => (length === 'long' ? 'round' : 'turn')

// Only 2-player games end this way, so this note only shows up in them.
const EndGameNote = ({ phase, length }: { phase: EndGamePhase; length?: string }) => (
  <p style={{ fontSize: 'smaller', fontStyle: 'italic', margin: '4px 0' }}>
    {phase.lastRound
      ? `Final ${roundOrTurn(length)}: the game ends at the end of this ${roundOrTurn(length)}.`
      : `End game: with ${phase.threshold} or fewer buildings unbuilt at the end of a ${roundOrTurn(length)}, the game ends. ${phase.unbuilt} unbuilt now.`}
  </p>
)

export const UnbuiltBuildings = () => {
  const { state, partial, controls, addPartial } = useInstanceContext()
  if (state === undefined) return <></>
  const { buildings, config, frame, players } = state
  const phase = endGamePhase(config, frame, buildings, players)

  return (
    <div style={{ minHeight: 450 }}>
      {phase && <EndGameNote phase={phase} length={config.length} />}
      {map(
        (building) => (
          <span key={building} style={{ marginRight: 10 }}>
            <Erection
              primary={head(partial) === 'BUILD' && partial.length === 1}
              id={building}
              disabled={!controls?.completion?.includes(building)}
              onClick={() => {
                addPartial(`${building}`)
              }}
            />
          </span>
        ),
        buildings
      )}
    </div>
  )
}
