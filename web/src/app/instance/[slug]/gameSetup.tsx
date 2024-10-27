'use client'

import { Seat } from '@/components/seat'
import { useInstanceContext } from '@/context/InstanceContext'
import { EngineCountry, EngineLength } from '@/types'
import { configureInstance, toggleHidden } from './actions'

const configured = (country: EngineCountry, length: EngineLength, firstCommand: string = '') =>
  firstCommand.includes(country.toLowerCase()) && firstCommand.includes(length.toLowerCase())

export const GameSetup = () => {
  const { gameState, instance, entrants } = useInstanceContext()

  const hidden = !!instance.hidden

  const canStart = entrants.length >= 1 && instance.commands?.[0]?.startsWith('CONFIG')

  const handleSetHidden = (newState: boolean) => {
    toggleHidden(instance.id, newState)
  }

  const config = async (players: number, country: EngineCountry, length: EngineLength) => {
    configureInstance(instance.id, `CONFIG ${Math.max(players, 1)} ${country.toLowerCase()} ${length.toLowerCase()}`)
  }

  return (
    <>
      <h1>Game Setup</h1>
      {/* <pre>{JSON.stringify({ gameState, instance }, undefined, 2)}</pre> */}
      <p>
        <a href={`/instance/${instance?.id}`}>/instance/{instance.id}</a>
      </p>
      <input type="checkbox" name="hidden" id="hidden" checked={hidden} onChange={() => handleSetHidden(!hidden)} />{' '}
      <label htmlFor="hidden">Hidden</label>{' '}
      {!hidden && (
        <button type="button" onClick={() => handleSetHidden(true)}>
          Make Hidden
        </button>
      )}
      {!!hidden && (
        <button type="button" onClick={() => handleSetHidden(false)}>
          Make Public
        </button>
      )}
      <br />
      <p>
        Making an instance public will list it to all users. Share the link directly to invite users to a private
        instance.
      </p>
      <hr />
      <h3>Players ({entrants.length})</h3>
      <Seat clergyId="LB1R" color={'red'} />
      <Seat clergyId="LB1G" color={'green'} />
      <Seat clergyId="LB1B" color={'blue'} />
      <Seat clergyId="LB1W" color={'white'} />
      <p>Player order will be randomized upon start.</p>
      {/*-------------------------------------------*/}
      <hr />
      <h3>Mode</h3>
      <input
        type="radio"
        disabled={configured(EngineCountry.france, EngineLength.long, instance?.commands?.[0])}
        checked={configured(EngineCountry.france, EngineLength.long, instance?.commands?.[0])}
        onChange={() => config(entrants.length, EngineCountry.france, EngineLength.long)}
      />
      <button
        type="button"
        disabled={configured(EngineCountry.france, EngineLength.long, instance?.commands?.[0])}
        onClick={() => config(entrants.length, EngineCountry.france, EngineLength.long)}
      >
        France {entrants?.length === 2 && '(long)'}
      </button>
      <br />
      <input
        type="radio"
        disabled={configured(EngineCountry.ireland, EngineLength.long, instance?.commands?.[0])}
        checked={configured(EngineCountry.ireland, EngineLength.long, instance?.commands?.[0])}
        onChange={() => config(entrants.length, EngineCountry.ireland, EngineLength.long)}
      />
      <button
        type="button"
        disabled={configured(EngineCountry.ireland, EngineLength.long, instance?.commands?.[0])}
        onClick={() => config(entrants.length, EngineCountry.ireland, EngineLength.long)}
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
            onChange={() => config(entrants.length, EngineCountry.france, EngineLength.short)}
          />
          <button
            type="button"
            disabled={configured(EngineCountry.france, EngineLength.short, instance?.commands?.[0])}
            onClick={() => config(entrants.length, EngineCountry.france, EngineLength.short)}
          >
            France {entrants?.length >= 3 && '(short)'}
          </button>
          <br />
          <input
            type="radio"
            disabled={configured(EngineCountry.ireland, EngineLength.short, instance?.commands?.[0])}
            checked={configured(EngineCountry.ireland, EngineLength.short, instance?.commands?.[0])}
            onChange={() => config(entrants.length, EngineCountry.ireland, EngineLength.long)}
          />
          <button
            type="button"
            disabled={configured(EngineCountry.ireland, EngineLength.short, instance?.commands?.[0])}
            onClick={() => config(entrants.length, EngineCountry.ireland, EngineLength.long)}
          >
            Ireland {entrants?.length >= 3 && '(short)'}
          </button>
          <br />
        </>
      )}
      <p>Country variants contain a different set of buildings.</p>
      <button type="button" disabled={!canStart}>
        Start Game
      </button>
      <hr />
      <i>Last Updated: </i>
      {instance.updated_at}
    </>
  )
}
