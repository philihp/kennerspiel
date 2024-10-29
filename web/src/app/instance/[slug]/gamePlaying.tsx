'use client'

import { MoveList } from '@/components/moveList'
import { Rondel } from '@/components/rondel'
import { Actions } from '@/components/sliders/actions'
import { UnbuiltBuildings } from '@/components/unbuiltBuildings'
import { UnbuiltDistricts } from '@/components/unbuiltDistricts'
import { UnbuiltPlots } from '@/components/unbuiltPlots'
import { UnbuiltWonders } from '@/components/unbuiltWonders'
import { useInstanceContext } from '@/context/InstanceContext'
import { Frame, GameStatePlaying } from 'hathora-et-labora-game'
import { map, nth, pipe, unwind } from 'ramda'

// const playerOrdering = (state?: GameStatePlaying) => {
//   if (state?.players.length === 1) return [0]

//   return map(
//     (n) => (n - (frame?.activePlayerIndex ?? 0) + (config?.players ?? 0)) % (config?.players ?? 0),
//     range(0, config?.players)
//   )
// }

export const GamePlaying = () => {
  const { state, instance } = useInstanceContext()
  if (state === undefined) return <>Missing Game State</>

  const { rondel, config, players, buildings, plotPurchasePrices, districtPurchasePrices, wonders } = state
  const soloNeutralBuild = state?.config?.players === 1 && !!state?.frame?.neutralBuildingPhase

  return (
    <>
      {/* <Actions /> */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 2fr 1fr' }}>
        <MoveList />
        <div>
          {plotPurchasePrices && <UnbuiltPlots plots={plotPurchasePrices} />}
          {districtPurchasePrices && <UnbuiltDistricts districts={districtPurchasePrices} />}
          {wonders && <UnbuiltWonders wonders={wonders} />}
          <Rondel />
          {buildings && <UnbuiltBuildings buildings={buildings} />}

          {/* {players &&
            pipe(
              map<EngineTableau, ReactNode>((player) => {
                return (
                  <Player
                    key={player.color}
                    player={player}
                    active={
                      (!!state?.control &&
                        !soloNeutralBuild &&
                        state?.users?.find((u) => u.color === player.color)?.id === state?.me?.id) ||
                      (soloNeutralBuild &&
                        !!state?.control?.partial?.startsWith('BUILD') &&
                        player === state?.players?.[1]) ||
                      (soloNeutralBuild &&
                        !!state?.control?.partial?.startsWith('SETTLE') &&
                        player === state?.players?.[0])
                    }
                  />
                )
              }),
              unwind(playerOrdering(state.config, state.frame)),
              nth(0)
            )(players)}
          <Debug /> */}
        </div>
        <pre>{JSON.stringify(state, undefined, 2)}</pre>
      </div>

      <hr />
      <i>Last Updated: </i>
      {instance.updated_at}
    </>
  )
}
