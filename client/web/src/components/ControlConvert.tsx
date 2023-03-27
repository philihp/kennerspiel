import React, { useState } from 'react'
import { EngineState } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

const resourceOptions = (state: EngineState): string[] => {
  if (state.players === undefined) return []
  if (state.frame?.currentPlayerIndex === undefined) return []
  const player = state.players[state.frame?.currentPlayerIndex]
  const options = []
  if (player.grain >= 1) options.push('Gn')
  if (player.wine >= 1) options.push('Wn')
  if (player.nickel >= 1) options.push('Ni')
  if (player.whiskey >= 1) options.push('Wh')
  if (player.penny >= 5) options.push('PnPnPnPnPn')
  return options
}

export const ControlConvert = () => {
  const [resource, setResource] = useState<string | undefined>(undefined)
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    move(`CONVERT ${resource}`)
    setResource(undefined)
  }

  const handleChangeResource = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResource(e.target.value)
  }

  const resources = resourceOptions(state)

  return (
    <form onSubmit={handleSubmit}>
      <select name="resource" value={resource} onChange={handleChangeResource}>
        <option value={undefined}> </option>
        {resources.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <button disabled={!resource} type="submit">
        convert
      </button>
    </form>
  )
}
