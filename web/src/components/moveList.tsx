import { addIndex, collectBy, find, flatten, map, range } from 'ramda'
import React from 'react'
import { useInstanceContext } from '@/context/InstanceContext'
import { Flower, PlayerColor } from 'hathora-et-labora-game/dist/types'
import { Tables } from '@/supabase.types'
import { Frame } from './frame'

const resetStyle = {
  margin: 0,
  padding: 0,
  listStyle: 'none',
  textIndent: 0,
  listStyleType: 'none',
}

type ColorStyle = {
  backgroundColor?: string
  borderColor?: string
}

const sameColor = (playerColor?: PlayerColor) => (entrant: Tables<'entrant'>) => {
  switch (playerColor) {
    case PlayerColor.Blue:
      return entrant.color === 'blue'
    case PlayerColor.Red:
      return entrant.color === 'red'
    case PlayerColor.Green:
      return entrant.color === 'green'
    case PlayerColor.White:
      return entrant.color === 'white'
    default:
      return false
  }
}

const colorToStyle = (c?: string): ColorStyle => {
  switch (c) {
    case 'B':
      return { borderColor: '#80b1d3' } // , borderColor: '#5f849e' }
    case 'R':
      return { borderColor: '#fb8072' } // , borderColor: '#ad574d' }
    case 'G':
      return { borderColor: '#b3de69' } // , borderColor: '#87a74f' }
    case 'W':
      return { borderColor: '#d9d9d9' } // , borderColor: '#b1b1b1' }
    default:
      return {}
  }
}

export const MoveList = () => {
  const { controls, state, commands, entrants, instance, undo, redo } = useInstanceContext()
  if (controls === undefined) return <>Missing Controls</>

  const handleUndo = () => {
    undo?.()
  }
  const handleRedo = () => {
    redo?.()
  }

  const flow = collectBy((f) => `${f.round}`, controls?.flow ?? [])

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
        {map(
          (i) => {
            const active = i === state?.frame?.activePlayerIndex
            const current = i === state?.frame?.currentPlayerIndex
            const player = state?.players?.[i]
            const score = controls?.score?.[i]
            const user = find(sameColor(player?.color), entrants ?? [])
            return (
              <div key={`player:${i}`} style={{ display: 'flex', gap: 4, alignItems: 'center', flexDirection: 'row' }}>
                <div style={{ minWidth: 20 }}>
                  {current && '🏵️'}
                  {!current && active && '⌚️'}
                </div>
                <div
                  title={user?.id}
                  style={{
                    ...colorToStyle(user?.color),
                    height: 32,
                    width: 32,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderStyle: 'solid',
                  }}
                >
                  {' '}
                </div>
                <div style={{}}>
                  {score?.total} points
                  {score?.settlements?.length !== 0 && (
                    <div style={{ fontSize: 'x-small' }}>Settlements: {score?.settlements?.join(', ')}</div>
                  )}
                </div>
              </div>
            )
          },
          range(0, controls?.score?.length ?? 0)
        )}
      </div>

      <hr />

      {controls === undefined && (
        <div>Waiting on {[state?.players?.[state?.frame?.activePlayerIndex ?? -1]?.color ?? -1]}...</div>
      )}
      {controls !== undefined && (
        <>
          <button type="button" disabled={!undo} onClick={handleUndo}>
            &#x25C0; Undo
          </button>
          <button type="button" disabled={!redo} onClick={handleRedo}>
            Redo &#x25B6;
          </button>
        </>
      )}

      <hr />

      <ul style={resetStyle}>
        {commands.slice(2).map((m, i) => (
          <li key={`${i}:${m}`}>{m}</li>
        ))}
        {addIndex(map<Flower, React.JSX.Element>)(
          (frame: Flower, n: number) => (
            <li key={JSON.stringify({ n, frame })}>
              <Frame frame={frame} />
            </li>
          ),
          flatten(flow)
        )}
      </ul>
    </div>
  )
}
