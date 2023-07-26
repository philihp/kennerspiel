import { curried as unwind } from 'sort-unwind'
import { add, map, nth, pipe, range } from 'ramda'
import { ReactNode } from 'react'
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
import { EngineConfig, EngineFrame, EngineTableau } from '../../../../api/types'

const playerOrdering = (config?: EngineConfig, frame?: EngineFrame) => {
  if (config === undefined || config.players === 1) return [0]
  return map(
    (n) => (n - (frame?.activePlayerIndex ?? 0) + (config?.players ?? 0)) % (config?.players ?? 0),
    range(0, config?.players)
  )
}

export const StatePlaying = () => {
  const { state } = useHathoraContext()
  if (state === undefined) return <div>Error, missing state</div>
  const { rondel, config, players, buildings, plotPurchasePrices, districtPurchasePrices, wonders } = state

  return (
    <>
      <Actions />
      <Submit />
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', paddingTop: 40 }}>
        <MoveList />
        <div>
          {rondel && config && <Rondel config={config} rondel={rondel} />}
          {buildings && <UnbuiltBuildings buildings={buildings} />}
          {plotPurchasePrices && <UnbuiltPlots plots={plotPurchasePrices} />}
          {districtPurchasePrices && <UnbuiltDistricts districts={districtPurchasePrices} />}
          {wonders && <UnbuiltWonders wonders={wonders} />}
          {players &&
            pipe(
              map<EngineTableau, ReactNode>((player) => {
                return (
                  <Player
                    key={player.color}
                    player={player}
                    active={
                      !!state?.control && state?.users?.find((u) => u.color === player.color)?.id === state?.me?.id
                    }
                  />
                )
              }),
              unwind(playerOrdering(state.config, state.frame)),
              nth(0)
            )(players)}
        </div>
      </div>
    </>
  )
}
