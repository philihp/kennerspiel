import { map } from 'ramda'
import { useState } from 'react'
import { useHathoraContext } from '../context/GameContext'
import { Player } from './Player'
import { Rondel } from './Rondel'
import { UnbuiltBuildings } from './UnbuiltBuildings'
import { UnbuiltPlots } from './UnbuiltPlots'
import { UnbuiltDistricts } from './UnbuiltDistricts'
import { UnbuiltWonders } from './UnbuiltWonders'

export const StatePlaying = () => {
  const { state, move } = useHathoraContext()
  const [command, setCommand] = useState<string>('')

  if (state === undefined) return <div>Error, missing state</div>

  const handleSubmit = () => {
    // move(command)
    console.log({ command })
    setCommand('')
  }

  const { rondel, config, players, buildings, plotPurchasePrices, districtPurchasePrices, wonders, ...elseState } =
    state

  return (
    <>
      <input type="text" placeholder="command" value={command} onChange={(e) => setCommand(e.target.value)} />
      <button type="submit" onClick={handleSubmit}>
        Explore
      </button>
      <hr />
      {rondel && config && <Rondel config={config} rondel={rondel} />}
      {buildings && <UnbuiltBuildings buildings={buildings} />}
      {plotPurchasePrices && <UnbuiltPlots plots={plotPurchasePrices} />}
      {districtPurchasePrices && <UnbuiltDistricts districts={districtPurchasePrices} />}
      {wonders && <UnbuiltWonders wonders={wonders} />}
      {players && map((player) => <Player key={player.color} player={player} />, players)}
      <pre>{JSON.stringify(elseState, undefined, 2)}</pre>
    </>
  )
}
