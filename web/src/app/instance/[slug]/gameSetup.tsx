'use client'

import { Seat } from '@/components/seat'
import { useInstanceContext } from '@/context/InstanceContext'
import { EngineConfig, EngineCountry, EngineLength } from '@/types'
import { join, toggleHidden } from './actions'

const configured = (country: EngineCountry, length: EngineLength, config?: EngineConfig) => false //config && config.country === country && config.length === length

export const GameSetup = () => {
  const { gameState, user, instance, entrants } = useInstanceContext()
  const users = [1, 2]
  const engineConfig = undefined

  const hidden = !!instance.hidden

  const handleSetHidden = (newState: boolean) => {
    toggleHidden(instance.id, newState)
  }

  return (
    <>
      <h1>Game Setup</h1>
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
        disabled={configured(EngineCountry.france, EngineLength.long, engineConfig)}
        checked={configured(EngineCountry.france, EngineLength.long, engineConfig)}
        onChange={() => {}}
      />
      <button
        type="button"
        disabled={configured(EngineCountry.france, EngineLength.long, engineConfig)}
        onClick={() => {}}
      >
        France {users?.length === 2 && '(long)'}
      </button>
      <br />
      <input
        type="radio"
        disabled={configured(EngineCountry.ireland, EngineLength.long, engineConfig)}
        checked={configured(EngineCountry.ireland, EngineLength.long, engineConfig)}
        onChange={() => {}}
      />
      <button
        disabled={configured(EngineCountry.ireland, EngineLength.long, engineConfig)}
        onClick={() => {}}
        type="button"
      >
        Ireland {users?.length === 2 && '(long)'}
      </button>
      <br />
      {users.length > 1 && (
        <>
          {' '}
          <input
            type="radio"
            disabled={configured(EngineCountry.france, EngineLength.short, engineConfig)}
            checked={configured(EngineCountry.france, EngineLength.short, engineConfig)}
            onChange={() => {}}
          />
          <button
            type="button"
            disabled={configured(EngineCountry.france, EngineLength.short, engineConfig)}
            onClick={() => {}}
          >
            France {users?.length >= 3 && '(short)'}
          </button>
          <br />
          <input
            type="radio"
            disabled={configured(EngineCountry.ireland, EngineLength.short, engineConfig)}
            checked={configured(EngineCountry.ireland, EngineLength.short, engineConfig)}
            onChange={() => {}}
          />
          <button
            type="button"
            disabled={configured(EngineCountry.ireland, EngineLength.short, engineConfig)}
            onClick={() => {}}
          >
            Ireland {users?.length >= 3 && '(short)'}
          </button>
          <br />
        </>
      )}
      <p>Country variants contain a different set of buildings.</p>
      <form></form>
      <hr />
      <i>Last Updated: </i>
      {instance.updated_at}
    </>
  )
}
