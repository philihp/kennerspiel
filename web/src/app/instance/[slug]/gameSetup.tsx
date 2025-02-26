'use client'

import { useInstanceContext } from '@/context/InstanceContext'
import { start } from './actions'
import { CopyPathButton } from '@/components/copyPathButton'
import { GameSetupHidden } from './gameSetupHidden'
import { GameSetupPlayers } from './gameSetupPlayers'
import { GameSetupVariant } from './gameSetupVariant'
import { useSupabaseContext } from '@/context/SupabaseContext'

export const GameSetup = () => {
  const { instance, entrants } = useInstanceContext()
  const { sequence } = useSupabaseContext()

  const canStart = entrants.length >= 1 && instance.commands?.[0]?.startsWith('CONFIG')

  const handleStart = async () => {
    await start(instance.id)
  }

  return (
    <>
      <h1>Game Setup {sequence}</h1>
      <p>
        <a
          style={{
            backgroundColor: 'white',
            display: 'inline',
            padding: 10,
            fontFamily: 'monospace',
            boxShadow: 'inset 0 0 2px #000',
          }}
          href={`/instance/${instance?.id}`}
        >
          {instance.id}
        </a>
        <CopyPathButton path={`/instance/${instance?.id}`} />
      </p>
      <p>Share this link with someone to invite them to the room.</p>
      <GameSetupHidden />
      <GameSetupPlayers />
      <GameSetupVariant />
      <button type="button" disabled={!canStart} onClick={handleStart}>
        Start Game
      </button>
      <hr />
      <i>Last Updated: </i>
      {instance.updated_at}
    </>
  )
}
