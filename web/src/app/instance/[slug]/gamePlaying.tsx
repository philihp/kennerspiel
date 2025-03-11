'use client'
import { curried as unwind } from 'sort-unwind'
import { MoveList } from '@/components/moveList'
import { Player } from '@/components/player/player'
import { Rondel } from '@/components/rondel/rondel'
import { Actions } from '@/components/sliders/actions'
import { UnbuiltBuildings } from '@/components/unbuiltBuildings'
import { UnbuiltDistricts } from '@/components/unbuiltDistricts'
import { UnbuiltPlots } from '@/components/unbuiltPlots'
import { UnbuiltWonders } from '@/components/unbuiltWonders'
import { useInstanceContext } from '@/context/InstanceContext'
import { Enums } from '@/supabase.types'
import { GameStatePlaying, Tableau } from 'hathora-et-labora-game'
import { PlayerColor } from 'hathora-et-labora-game/dist/types'
import { map, pipe, range } from 'ramda'
import { ReactNode } from 'react'
import { match } from 'ts-pattern'

const playerOrdering = (state?: GameStatePlaying) => {
  if (state === undefined) return []
  if (state.players.length === 0) return []
  if (state.players.length === 1) return [0]
  const frame = state.frame
  const config = state.config
  const players = config.players ?? 0

  return map((n) => (n - (frame?.activePlayerIndex ?? 0) + players) % players, range(0, state.players.length))
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

  const { players } = state

  const playerOrder = playerOrdering(state)
  const soloNeutralBuild = state?.config?.players === 1 && !!state?.frame?.neutralBuildingPhase

  const unwinder: (src: Tableau[]) => [Tableau[], number[]] = unwind(playerOrder)
  const zeroth = (src: [Tableau[], number[]]): Tableau[] => src[0]

  const tableauToReact = map<Tableau, ReactNode>((tableau) => {
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
  const playerBoards = pipe<[Tableau[]], [Tableau[], number[]], Tableau[], ReactNode[]>(
    unwinder,
    zeroth,
    tableauToReact
  )(players)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 2fr' }}>
        <MoveList />
        <div>
          <Actions />
          <UnbuiltPlots />
          <UnbuiltDistricts />
          <UnbuiltWonders />
          <Rondel />
          <UnbuiltBuildings />
          {playerBoards}
        </div>
      </div>

      <hr />
      <i>Last Updated: </i>
      {instance.updated_at}
    </>
  )
}
