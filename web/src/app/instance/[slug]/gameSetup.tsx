'use client'

import { useInstanceContext } from '@/context/InstanceContext'
import { start } from './actions'
import { CopyPathButton } from '@/components/copyPathButton'
import { GameSetupHidden } from './gameSetupHidden'
import { GameSetupPlayers } from './gameSetupPlayers'
import { GameSetupVariant } from './gameSetupVariant'
import { usePathname } from 'next/navigation'

export const GameSetup = () => {
  const path = usePathname()
  const { instance, setInstance, entrants } = useInstanceContext()

  const canStart = entrants.length >= 1 && instance.commands?.[0]?.startsWith('CONFIG')

  const handleStart = async () => {
    const newInstance = await start(instance.id)
    if (newInstance) setInstance({ ...newInstance })
  }

  return (
    <>
      <h1>Game Setup</h1>
      <p>
        <a
          style={{
            backgroundColor: '#0d0d0d',
            display: 'inline',
            padding: 10,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: '#00ff41',
            border: '2px solid #00ff41',
            boxShadow: '3px 3px 0 #005c18',
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
