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
      const [, erection, clergy] = tile
      if (erection === undefined || erection === 'LFO' || erection === 'LPE' || clergy !== undefined) {
        return
      }
      peatSpots.push(`${erection}`)
    })
  })
  return peatSpots
}

export const ControlUse = () => {
  const [building, setBuilding] = useState<string | undefined>(undefined)
  const [param, setParam] = useState<string>('')
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    move(`USE ${building} ${param}`)
    setBuilding(undefined)
    setParam('')
  }

  const buildings = usableBuildings(state)
  return (
    <form onSubmit={handleSubmit}>
      <select name="building" value={building} onChange={(e) => setBuilding(e.target.value)}>
        <option value={undefined}> </option>
        {buildings.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <input type="text" value={param} onChange={(e) => setParam(e.target.value)} />
      <button disabled={!building} type="submit">
        use
      </button>
    </form>
  )
}
