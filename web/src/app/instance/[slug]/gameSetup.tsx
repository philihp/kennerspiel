'use client'

import { Seat } from '@/components/seat'
import { useInstanceContext } from '@/context/InstanceContext'
import { EngineCountry, EngineLength } from '@/types'
import { config, join, start, toggleHidden } from './actions'
import { find, propEq } from 'ramda'
import { Enums, Tables } from '@/supabase.types'
import { useOptimistic } from 'react'

const configured = (country: EngineCountry, length: EngineLength, firstCommand: string = '') =>
  firstCommand.includes(country.toLowerCase()) && firstCommand.includes(length.toLowerCase())

export const GameSetup = () => {
  const { instance, entrants, setEntrants } = useInstanceContext()

  const hidden = !!instance.hidden

  const canStart = entrants.length >= 1 && instance.commands?.[0]?.startsWith('CONFIG')

  const [optimisticEntrants, setOptimisticJoin] = useOptimistic(
    entrants,
    (state: Tables<'entrant'>[], color: Enums<'color'>) => {
      const out = [...state.map((entrant) => ({ ...entrant, color: color }))]
      return out
    }
  )

  const findEntrant = (color: Enums<'color'>) => find<Tables<'entrant'>>(propEq(color, 'color'))(optimisticEntrants)

  const handleSeatSelect = async (color: Enums<'color'>) => {
    setOptimisticJoin(color)
    await join(instance.id, color)
    setEntrants([...entrants.map((entrant) => ({ ...entrant, color: color }))])
  }

  const handleSetHidden = (newState: boolean) => {
    toggleHidden(instance.id, newState)
  }

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
      <pre>{JSON.stringify(entrants, undefined, 2)}</pre>
      <Seat clergyId="LB1R" entrant={findEntrant('red')} onClick={() => handleSeatSelect('red')} />
      <Seat
        clergyId="LB1G"
        entrant={find<Tables<'entrant'>>(propEq('green', 'color'))(optimisticEntrants)}
        onClick={() => handleSeatSelect('green')}
      />
      <Seat
        clergyId="LB1B"
        entrant={find<Tables<'entrant'>>(propEq('blue', 'color'))(optimisticEntrants)}
        onClick={() => handleSeatSelect('blue')}
      />
      <Seat
        clergyId="LB1W"
        entrant={find<Tables<'entrant'>>(propEq('white', 'color'))(optimisticEntrants)}
        onClick={() => handleSeatSelect('white')}
      />
      <p>Player order will be randomized upon start.</p>
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
