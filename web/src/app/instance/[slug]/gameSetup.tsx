'use client'

import { useInstanceContext } from '@/context/InstanceContext'
import { EngineCountry, EngineLength } from '@/types'
import { config, start } from './actions'
import { CopyPathButton } from '@/components/copyPathButton'
import { GameSetupHidden } from './gameSetupHidden'
import { GameSetupPlayers } from './gameSetupPlayers'

const configured = (country: EngineCountry, length: EngineLength, firstCommand: string = '') =>
  firstCommand.includes(country.toLowerCase()) && firstCommand.includes(length.toLowerCase())

export const GameSetup = () => {
  const { instance, entrants } = useInstanceContext()

  const canStart = entrants.length >= 1 && instance.commands?.[0]?.startsWith('CONFIG')

  const handleConfig = async (players: number, country: EngineCountry, length: EngineLength) => {
    config(instance.id, `CONFIG ${Math.max(players, 1)} ${country.toLowerCase()} ${length.toLowerCase()}`)
  }

  const handleStart = async () => {
    await start(instance.id)
  }

  return (
    <>
      <h1>Game Setup</h1>
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
      <hr />
      <GameSetupHidden />
      <hr />
      <GameSetupPlayers />
      {/*-------------------------------------------*/}
      <hr />
      <h3>Mode</h3>
      <input
        type="radio"
        disabled={configured(EngineCountry.france, EngineLength.long, instance?.commands?.[0])}
        checked={configured(EngineCountry.france, EngineLength.long, instance?.commands?.[0])}
        onChange={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.long)}
      />
      <button
        type="button"
        disabled={configured(EngineCountry.france, EngineLength.long, instance?.commands?.[0])}
        onClick={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.long)}
      >
        France {entrants?.length === 2 && '(long)'}
      </button>
      <br />
      <input
        type="radio"
        disabled={configured(EngineCountry.ireland, EngineLength.long, instance?.commands?.[0])}
        checked={configured(EngineCountry.ireland, EngineLength.long, instance?.commands?.[0])}
        onChange={() => handleConfig(entrants.length, EngineCountry.ireland, EngineLength.long)}
      />
      <button
        type="button"
        disabled={configured(EngineCountry.ireland, EngineLength.long, instance?.commands?.[0])}
        onClick={() => handleConfig(entrants.length, EngineCountry.ireland, EngineLength.long)}
      >
        Ireland {entrants?.length === 2 && '(long)'}
      </button>
      <br />
      {entrants.length > 1 && (
        <>
          {' '}
          <input
            type="radio"
            disabled={configured(EngineCountry.france, EngineLength.short, instance?.commands?.[0])}
            checked={configured(EngineCountry.france, EngineLength.short, instance?.commands?.[0])}
            onChange={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.short)}
          />
          <button
            type="button"
            disabled={configured(EngineCountry.france, EngineLength.short, instance?.commands?.[0])}
            onClick={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.short)}
          >
            France {entrants?.length >= 3 && '(short)'}
          </button>
          <br />
          <input
            type="radio"
            disabled={configured(EngineCountry.ireland, EngineLength.short, instance?.commands?.[0])}
            checked={configured(EngineCountry.ireland, EngineLength.short, instance?.commands?.[0])}
            onChange={() => handleConfig(entrants.length, EngineCountry.ireland, EngineLength.long)}
          />
          <button
            type="button"
            disabled={configured(EngineCountry.ireland, EngineLength.short, instance?.commands?.[0])}
            onClick={() => handleConfig(entrants.length, EngineCountry.ireland, EngineLength.long)}
          >
            Ireland {entrants?.length >= 3 && '(short)'}
          </button>
          <br />
        </>
      )}
      <p>Country variants contain a different set of buildings.</p>
      <button type="button" disabled={!canStart} onClick={handleStart}>
        Start Game
      </button>
      <hr />
      <i>Last Updated: </i>
      {instance.updated_at}
    </>
  )
}
