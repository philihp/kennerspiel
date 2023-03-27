import React, { useState } from 'react'
import { EngineState } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

const buildSpots = (state: EngineState): string[] => {
  if (state.players === undefined) return []
  if (state.frame?.currentPlayerIndex === undefined) return []
  const player = state.players[state.frame?.currentPlayerIndex]
  const peatSpots: string[] = []
  player.landscape.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      const [land, erection] = tile
      if (land === undefined || erection !== undefined) {
        return
      }
      peatSpots.push(`${colIndex - 2} ${rowIndex + player.landscapeOffset}`)
    })
  })
  return peatSpots
}

export const ControlBuild = () => {
  const [building, setBuilding] = useState<string | undefined>(undefined)
  const [site, setSite] = useState<string | undefined>(undefined)
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    move(`BUILD ${building} ${site}`)
    setBuilding(undefined)
    setSite(undefined)
  }

  const handleChangeBuilding = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBuilding(e.target.value)
  }
  const handleChangeSite = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSite(e.target.value)
  }

  const buildings = state?.buildings ?? []
  const sites = buildSpots(state)

  return (
    <form onSubmit={handleSubmit}>
      <select name="building" value={building} onChange={handleChangeBuilding}>
        <option value={undefined}> </option>
        {buildings.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <select name="site" value={site} onChange={handleChangeSite}>
        <option value={undefined}> </option>
        {sites.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <button disabled={!building} type="submit">
        build
      </button>
    </form>
  )
}
