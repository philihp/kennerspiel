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
import { GameState, Tableau } from 'hathora-et-labora-game'
import { PlayerColor } from 'hathora-et-labora-game/dist/types'
import { map, pipe, range } from 'ramda'
import { ReactNode, useState } from 'react'
import { match } from 'ts-pattern'
import { Alerts } from '@/components/alerts'

const playerOrdering = (state?: GameState) => {
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
  const { state, user, controls, entrants, instance, active, rawState } = useInstanceContext()
  const [debugOpen, setDebugOpen] = useState(false)
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
          <Alerts />
          <Rondel />
          <UnbuiltBuildings />
          {playerBoards}
          <UnbuiltPlots />
          <UnbuiltDistricts />
          <UnbuiltWonders />
        </div>
      </div>
      <hr />
      <i>Last Updated: </i>
      {instance.updated_at} <button onClick={() => setDebugOpen(true)}>Debug</button>
      {debugOpen && (
        <dialog
          open
          style={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            zIndex: 1000,
            padding: 16,
            border: '1px solid #ccc',
            borderRadius: 8,
            background: '#fff',
          }}
        >
          <button onClick={() => setDebugOpen(false)} style={{ float: 'right' }}>
            Close
          </button>
          <h3 style={{ marginTop: 0 }}>State</h3>
          <pre style={{ fontSize: 11, overflowX: 'auto', background: '#f8f8f8', padding: 8 }}>
            {JSON.stringify(rawState, null, 2)}
          </pre>
          <h3>Controls</h3>
          <pre style={{ fontSize: 11, overflowX: 'auto', background: '#f8f8f8', padding: 8 }}>
            {JSON.stringify(controls, null, 2)}
          </pre>
        </dialog>
      )}
    </>
  )
}
