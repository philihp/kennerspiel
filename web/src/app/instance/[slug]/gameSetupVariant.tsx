import { useInstanceContext } from '@/context/InstanceContext'
import { EngineCountry, EngineLength } from '@/types'
import { config } from './actions'
import { Tables } from '@/supabase.types'
import { useOptimistic, useTransition } from 'react'

type Instance = Tables<'instance'>

const configured = (country: EngineCountry, length: EngineLength, firstCommand: string = '') =>
  firstCommand.includes(country.toLowerCase()) && firstCommand.includes(length.toLowerCase())

export const GameSetupVariant = () => {
  const { instance, setInstance, entrants } = useInstanceContext()

  const [optInstance, setOptInstance] = useOptimistic<Instance, [EngineCountry, EngineLength]>(
    instance,
    // optimistically, predict what the resulting list of entrants will look like
    (oldInstance, [country, length]) => {
      console.log([`CONFIG ${entrants.length} ${country.toLowerCase()} ${length.toLowerCase()}`])
      return {
        ...oldInstance,
        commands: [`CONFIG ${entrants.length} ${country.toLowerCase()} ${length.toLowerCase()}`],
      }
    }
  )

  const [_isPending, startTransition] = useTransition()

  const handleConfig = async (players: number, country: EngineCountry, length: EngineLength) => {
    startTransition(async () => {
      // optimistic reducer
      console.log('optimistic')
      setOptInstance([country, length])
      const updatedInstance = await config(
        instance.id,
        `CONFIG ${Math.max(players, 1)} ${country.toLowerCase()} ${length.toLowerCase()}`
      )
      console.log('pessimistic')
      // pessimistic reducer
      if (updatedInstance) setInstance(updatedInstance)
    })
  }

  return (
    <>
      <hr />
      <h3>Mode</h3>
      <input
        type="radio"
        disabled={configured(EngineCountry.france, EngineLength.long, optInstance?.commands?.[0])}
        checked={configured(EngineCountry.france, EngineLength.long, optInstance?.commands?.[0])}
        onChange={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.long)}
      />
      <button
        type="button"
        disabled={configured(EngineCountry.france, EngineLength.long, optInstance?.commands?.[0])}
        onClick={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.long)}
      >
        France {entrants?.length === 2 && '(long)'}
      </button>
      <br />
      <input
        type="radio"
        disabled={configured(EngineCountry.ireland, EngineLength.long, optInstance?.commands?.[0])}
        checked={configured(EngineCountry.ireland, EngineLength.long, optInstance?.commands?.[0])}
        onChange={() => handleConfig(entrants.length, EngineCountry.ireland, EngineLength.long)}
      />
      <button
        type="button"
        disabled={configured(EngineCountry.ireland, EngineLength.long, optInstance?.commands?.[0])}
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
            disabled={configured(EngineCountry.france, EngineLength.short, optInstance?.commands?.[0])}
            checked={configured(EngineCountry.france, EngineLength.short, optInstance?.commands?.[0])}
            onChange={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.short)}
          />
          <button
            type="button"
            disabled={configured(EngineCountry.france, EngineLength.short, optInstance?.commands?.[0])}
            onClick={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.short)}
          >
            France {entrants?.length >= 3 && '(short)'}
          </button>
          <br />
          <input
            type="radio"
            disabled={configured(EngineCountry.ireland, EngineLength.short, optInstance?.commands?.[0])}
            checked={configured(EngineCountry.ireland, EngineLength.short, optInstance?.commands?.[0])}
            onChange={() => handleConfig(entrants.length, EngineCountry.ireland, EngineLength.long)}
          />
          <button
            type="button"
            disabled={configured(EngineCountry.ireland, EngineLength.short, optInstance?.commands?.[0])}
            onClick={() => handleConfig(entrants.length, EngineCountry.ireland, EngineLength.long)}
          >
            Ireland {entrants?.length >= 3 && '(short)'}
          </button>
          <br />
        </>
      )}
      <p>Country variants contain a different set of buildings.</p>
    </>
  )
}
