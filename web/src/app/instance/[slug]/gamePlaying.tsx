'use client'

import { MoveList } from '@/components/moveList'
import { Player } from '@/components/player/player'
import { Rondel } from '@/components/rondel'
import { Actions } from '@/components/sliders/actions'
import { UnbuiltBuildings } from '@/components/unbuiltBuildings'
import { UnbuiltDistricts } from '@/components/unbuiltDistricts'
import { UnbuiltPlots } from '@/components/unbuiltPlots'
import { UnbuiltWonders } from '@/components/unbuiltWonders'
import { useInstanceContext } from '@/context/InstanceContext'
import { Enums } from '@/supabase.types'
import { Frame, GameStatePlaying, Tableau } from 'hathora-et-labora-game'
import { PlayerColor } from 'hathora-et-labora-game/dist/types'
import { map, nth, pipe, range, unwind } from 'ramda'
import { ReactNode } from 'react'
import { match } from 'ts-pattern'

const playerOrdering = (state?: GameStatePlaying) => {
  if (state?.players.length === 1) return [0]
  const frame = state?.frame
  const config = state?.config

  return map(
    (n) => (n - (frame?.activePlayerIndex ?? 0) + (config?.players ?? 0)) % (config?.players ?? 0),
    range(0, config?.players ?? 0)
  )
}

const engineColorToEntrantColor = (c: PlayerColor): Enums<'color'> =>
  match<PlayerColor, Enums<'color'>>(c)
    .with(PlayerColor.Red, () => 'red')
    .with(PlayerColor.Green, () => 'green')
    .with(PlayerColor.Blue, () => 'blue')
    .with(PlayerColor.White, () => 'white')
    .exhaustive()

export const GamePlaying = () => {
  const { state, user, controls, entrants, instance, active } = useInstanceContext()
  if (state === undefined) return <>Missing Game State</>

  const { rondel, config, players, buildings, plotPurchasePrices, districtPurchasePrices, wonders } = state

  const playerOrder = playerOrdering(state)
  const soloNeutralBuild = state?.config?.players === 1 && !!state?.frame?.neutralBuildingPhase

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 2fr' }}>
        <MoveList />
        <div>
          <Actions />
          {plotPurchasePrices && <UnbuiltPlots plots={plotPurchasePrices} />}
          {districtPurchasePrices && <UnbuiltDistricts districts={districtPurchasePrices} />}
          {wonders && <UnbuiltWonders wonders={wonders} />}
          <Rondel />
          {buildings && <UnbuiltBuildings buildings={buildings} />}

          {players &&
            pipe<[Tableau[]], ReactNode[]>(
              map<Tableau, ReactNode>((tableau) => {
                const entrant = entrants.find((e) => e.color === engineColorToEntrantColor(tableau?.color))
                const playerActive =
                  active &&
                  ((controls !== undefined && !soloNeutralBuild && entrant?.profile_id === user?.id) ||
                    (soloNeutralBuild && controls?.partial?.[0] === 'BUILD' && tableau === players?.[1]) ||
                    (soloNeutralBuild && controls?.partial?.[0] === 'SETTLE' && tableau === players?.[0]))
                return (
                  <div key={tableau.color}>
                    <Player tableau={tableau} active={playerActive} />
                  </div>
                )
              })
            )(players)}
          {/*           <Debug /> */}
        </div>
        {/* <pre>{JSON.stringify(state, undefined, 2)}</pre> */}
      </div>

      <hr />
      <i>Last Updated: </i>
      {instance.updated_at}
    </>
  )
}
