import { addIndex, collectBy, find, flatten, map, range } from 'ramda'
import React from 'react'
import { useInstanceContext } from '@/context/InstanceContext'
import { Flower, PlayerColor } from 'hathora-et-labora-game/dist/types'
import { Tables } from '@/supabase.types'
import { Frame } from './frame'
import { FastForwardIcon, RewindIcon } from 'lucide-react'

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
      return { borderColor: '#80b1d3', backgroundColor: '#5f849e' } // '#5f849e' } // backgroundColor: '#80b1d3',
    case 'R':
      return { borderColor: '#fb8072', backgroundColor: '#fceceb' } // '#ad574d' } // backgroundColor: '#fb8072',
    case 'G':
      return { borderColor: '#b3de69', backgroundColor: '#87a74f' } // '#87a74f' } // backgroundColor: '#b3de69',
    case 'W':
      return { borderColor: '#d9d9d9', backgroundColor: '#b1b1b1' } // '#b1b1b1' } // backgroundColor: '#d9d9d9',
    default:
      return {}
  }
}

export const MoveList = () => {
  const { controls, state, commands, entrants, instance, undo, redo } = useInstanceContext()

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
    </div>
  )
}
