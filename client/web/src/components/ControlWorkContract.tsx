import React, { useState } from 'react'
import { EngineState } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

const buildingsOwnedByOtherPlayers = (state: EngineState): string[] => {
  if (state.players === undefined) return []
  if (state.frame?.currentPlayerIndex === undefined) return []
  const peatSpots: string[] = []
  state.players.forEach((player, playerIndex) => {
    if (playerIndex === state.frame?.currentPlayerIndex) return
    player.landscape.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        const [land, erection, clergy] = tile
        if (
          land === undefined ||
          erection === undefined ||
          erection === 'LFO' ||
          erection === 'LPE' ||
          clergy !== undefined
        ) {
          return
        }
        peatSpots.push(`${erection}`)
      })
    })
  })
  return peatSpots
}

const paymentOptions = (state: EngineState): string[] => {
  if (state.players === undefined) return []
  if (state.frame?.currentPlayerIndex === undefined) return []
  const player = state.players[state.frame?.currentPlayerIndex]
  const options = []
  const cost =
    state.frame?.settlementRound === 'S' ||
    state.frame?.settlementRound === 'A' ||
    state.buildings.includes('I21') ||
    state.buildings.includes('F21')
      ? 1
      : 2
  if (player.penny >= 1 && cost === 1) options.push('Pn')
  if (player.penny >= 2 && cost === 2) options.push('PnPn')
  if (player.wine >= 1) options.push('Wn')
  if (player.whiskey >= 1) options.push('Wh')
  return options
}

export const ControlWorkContract = () => {
  const [building, setBuilding] = useState<string | undefined>(undefined)
  const [payment, setPayment] = useState<string | undefined>(undefined)
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    move(`WORK_CONTRACT ${building} ${payment}`)
    setBuilding(undefined)
    setPayment(undefined)
  }

  const handleChangeBuilding = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBuilding(e.target.value)
  }
  const handleChangePayment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPayment(e.target.value)
  }

  const buildings = buildingsOwnedByOtherPlayers(state)
  const payments = paymentOptions(state)

  return (
    <form onSubmit={handleSubmit}>
      <select name="building" value={building} onChange={handleChangeBuilding}>
        <option value={undefined}> </option>
        {buildings.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <select name="payment" value={payment} onChange={handleChangePayment}>
        <option value={undefined}> </option>
        {payments.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <button disabled={!building || !payment} type="submit">
        work contract
      </button>
    </form>
  )
}
