import React, { useState } from 'react'
import { EngineState } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

const usableBuildings = (state: EngineState): string[] => {
  if (state.players === undefined) return []
  if (state.frame?.currentPlayerIndex === undefined) return []
  if (state.frame?.usableBuildings?.length > 0) return state.frame?.usableBuildings
  const player = state.players[state.frame?.currentPlayerIndex]
  const peatSpots: string[] = []
  player.landscape.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      const [, erection] = tile
      if (erection === undefined || erection === 'LFO' || erection === 'LPE') {
        return
      }
      peatSpots.push(`${erection}`)
    })
  })
  return peatSpots
}

export const ControlUse = () => {
  const [building, setBuilding] = useState<string | undefined>(undefined)
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    move(`USE ${building}`)
    setBuilding(undefined)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBuilding(e.target.value)
  }

  const buildings = usableBuildings(state)
  return (
    <form onSubmit={handleSubmit}>
      <select name="building" value={building} onChange={handleChange}>
        <option value={undefined}> </option>
        {buildings.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <button disabled={!building} type="submit">
        use
      </button>
    </form>
  )
}
