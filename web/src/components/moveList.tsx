import { addIndex, collectBy, find, flatten, map, range } from 'ramda'
import React, { useState } from 'react'
import { useInstanceContext } from '@/context/InstanceContext'
import { Flower, PlayerColor } from 'hathora-et-labora-game/dist/types'
import { Tables } from '@/supabase.types'
import { Frame } from './frame'
import { FastForwardIcon, RewindIcon } from 'lucide-react'
import { buildingName } from './buildingName'

const CommandDisplay = ({ command }: { command: string }) => {
  const tokens = command.split(' ')
  return (
    <>
      {tokens.map((token, i) => {
        const name = buildingName(token)
        return (
          <React.Fragment key={i}>
            {i > 0 && ' '}
            {name ? (
              <span title={token} style={{ borderBottom: '1px dotted currentColor', cursor: 'help' }}>
                {name}
              </span>
            ) : (
              token
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

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
    case 'R':
      return { borderColor: '#fb8072', backgroundColor: '#fceceb' } // '#ad574d' } // backgroundColor: '#fb8072',
    case 'G':
      return { borderColor: '#87a74f', backgroundColor: '#b3de69' } // '#87a74f' } // backgroundColor: '#b3de69',
    case 'B':
      return { borderColor: '#80b1d3', backgroundColor: '#5f849e' } // '#5f849e' } // backgroundColor: '#80b1d3',
    case 'W':
      return { borderColor: '#d9d9d9', backgroundColor: '#b1b1b1' } // '#b1b1b1' } // backgroundColor: '#d9d9d9',
    default:
      return {}
  }
}

export const MoveList = () => {
  const { controls, state, commands, entrants, instance, undo, redo } = useInstanceContext()
  const [showAll, setShowAll] = useState(false)

  if (controls === undefined) return <>Missing Controls</>

  const numPlayers = controls?.score?.length ?? 1
  const allCommands = commands.slice(2)
  const visibleLimit = 15 * numPlayers
  const visibleCommands = showAll || allCommands.length <= visibleLimit ? allCommands : allCommands.slice(-visibleLimit)
  const hiddenCount = allCommands.length - visibleCommands.length

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
                <div
                  title={user?.id}
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 16,
                    borderWidth: 3,
                    borderStyle: 'solid',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...colorToStyle(player?.color),
                  }}
                >
                  {current && '🏵️'}
                  {!current && active && '⌚️'}
                </div>
                <div>
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
            <RewindIcon size={16} />
          </button>
          <button type="button" disabled={!redo} onClick={handleRedo}>
            <FastForwardIcon size={16} />
          </button>
        </>
      )}

      <hr />

      <ul style={resetStyle}>
        {hiddenCount > 0 && (
          <li>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 0',
                cursor: 'pointer',
                color: 'inherit',
                fontSize: 'inherit',
                textDecoration: 'underline',
              }}
            >
              ↑ Show {hiddenCount} older move{hiddenCount !== 1 ? 's' : ''}
            </button>
          </li>
        )}
        {visibleCommands.map((m, i) => (
          <li key={`${hiddenCount + i}:${m}`}>
            <CommandDisplay command={m} />
          </li>
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
