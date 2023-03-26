import React, { useState } from 'react'
import { EngineState } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

const forestLocations = (state: EngineState): string[] => {
  if (state.players === undefined) return []
  if (state.frame?.currentPlayerIndex === undefined) return []
  const player = state.players[state.frame?.currentPlayerIndex]
  const peatSpots: string[] = []
  player.landscape.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      const [, erection] = tile
      if (erection === 'LFO') {
        peatSpots.push(`${colIndex - 2} ${rowIndex + player.landscapeOffset}`)
      }
    })
  })
  return peatSpots
}

export const ControlFellTrees = () => {
  const [location, setLocation] = useState<string | undefined>(undefined)
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    move(`FELL_TREES ${location}`)
    setLocation(undefined)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value)
  }

  const locations = forestLocations(state)
  return (
    <form onSubmit={handleSubmit}>
      <select name="location" value={location} onChange={handleChange}>
        <option value={undefined}> </option>
        {locations.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <button disabled={!location} type="submit">
        fell trees
      </button>
    </form>
  )
}
