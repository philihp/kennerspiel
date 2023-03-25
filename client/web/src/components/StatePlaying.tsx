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
  const { state, move, undo, redo } = useHathoraContext()
  const [command, setCommand] = useState<string>('')

  if (state === undefined) return <div>Error, missing state</div>

  const handleSubmit = () => {
    move(command)
    setCommand('')
  }
  const { rondel, config, players, buildings, plotPurchasePrices, districtPurchasePrices, wonders, ...elseState } =
    state

  return (
    <>
      {/* {state?.active && (
        <>
          <button type="button" onClick={undo}>
            Undo
          </button>
          <button type="button" onClick={redo}>
            Redo
          </button>
          <input type="text" placeholder="command" value={command} onChange={(e) => setCommand(e.target.value)} />
          <button type="submit" onClick={handleSubmit}>
            Explore
          </button>
        </>
      )} */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {rondel && config && <Rondel config={config} rondel={rondel} />}
        <div>
          {buildings && <UnbuiltBuildings buildings={buildings} />}
          {plotPurchasePrices && <UnbuiltPlots plots={plotPurchasePrices} />}
          {districtPurchasePrices && <UnbuiltDistricts districts={districtPurchasePrices} />}
          {wonders && <UnbuiltWonders wonders={wonders} />}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        {players &&
          map(
            (player) => (
              <Player
                key={player.color}
                player={player}
                active={state?.active && state?.users?.find((u) => u.color === player.color)?.id === state?.me?.id}
              />
            ),
            players
          )}
      </div>
      <pre>{JSON.stringify(elseState, undefined, 2)}</pre>
    </>
  )
}
