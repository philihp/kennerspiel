import { map } from 'ramda'
import { useHathoraContext } from '../context/GameContext'
import { Player } from './Player'
import { Rondel } from './Rondel'
import { UnbuiltBuildings } from './UnbuiltBuildings'
import { UnbuiltPlots } from './UnbuiltPlots'
import { UnbuiltDistricts } from './UnbuiltDistricts'
import { UnbuiltWonders } from './UnbuiltWonders'
import { MoveList } from './MoveList'

export const StatePlaying = () => {
  const { state } = useHathoraContext()
  if (state === undefined) return <div>Error, missing state</div>
  const { rondel, config, players, buildings, plotPurchasePrices, districtPurchasePrices, wonders, ...elseState } =
    state

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 470px 1fr' }}>
        <MoveList />
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
    </>
  )
}
