import { map } from 'ramda'
import { useHathoraContext } from '../context/GameContext'
import { Player } from './Player'
import { Rondel } from './Rondel'
import { UnbuiltBuildings } from './UnbuiltBuildings'
import { UnbuiltPlots } from './UnbuiltPlots'
import { UnbuiltDistricts } from './UnbuiltDistricts'
import { UnbuiltWonders } from './UnbuiltWonders'
import { MoveList } from './MoveList'
import { Actions } from './sliders/Actions'
import { Submit } from './sliders/Submit'

export const StatePlaying = () => {
  const { state } = useHathoraContext()
  if (state === undefined) return <div>Error, missing state</div>
  const { rondel, config, players, buildings, plotPurchasePrices, districtPurchasePrices, wonders } = state

  return (
    <>
      <Actions />
      <Submit />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 470px 200px', paddingTop: 40 }}>
        <div>
          {buildings && <UnbuiltBuildings buildings={buildings} />}
          {plotPurchasePrices && <UnbuiltPlots plots={plotPurchasePrices} />}
          {districtPurchasePrices && <UnbuiltDistricts districts={districtPurchasePrices} />}
          {wonders && <UnbuiltWonders wonders={wonders} />}
        </div>
        {rondel && config && <Rondel config={config} rondel={rondel} />}
        <MoveList />
      </div>
      {players &&
        map(
          (player) => (
            <Player
              key={player.color}
              player={player}
              active={!!state?.control && state?.users?.find((u) => u.color === player.color)?.id === state?.me?.id}
            />
          ),
          players
        )}
    </>
  )
}
