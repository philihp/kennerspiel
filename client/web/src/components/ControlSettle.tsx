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

export const ControlSettle = () => {
  const [settlement, setSettlement] = useState<string | undefined>(undefined)
  const [site, setSite] = useState<string | undefined>(undefined)
  const [param, setParam] = useState<string>('')
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    move(`SETTLE ${settlement} ${site} ${param}`)
    setSettlement(undefined)
    setSite(undefined)
    setParam('')
  }

  const handleChangeSettlement = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettlement(e.target.value)
  }
  const handleChangeSite = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSite(e.target.value)
  }

  if (state.players === undefined) return 'Error: No Players'
  if (state.frame?.activePlayerIndex === undefined) return 'Error: No Active Player'
  const player = state.players[state.frame?.activePlayerIndex]
  const settlements = player.settlements ?? []
  const sites = buildSpots(state)

  return (
    <form onSubmit={handleSubmit}>
      <select name="settlement" value={settlement} onChange={handleChangeSettlement}>
        <option value={undefined}> </option>
        {settlements.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <select name="site" value={site} onChange={handleChangeSite}>
        <option value={undefined}> </option>
        {sites.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <input type="text" value={param} onChange={(e) => setParam(e.target.value)} />
      <button disabled={!settlement || !state.frame.bonusActions.includes('SETTLE')} type="submit">
        settle
      </button>
    </form>
  )
}
