import { useInstanceContext } from '@/context/InstanceContext'
import { EngineCountry, EngineLength } from '@/types'
import { config } from './actions'
import { Tables } from '@/supabase.types'
import { EventHandler, ReactNode, SyntheticEvent, useOptimistic, useTransition } from 'react'

type Instance = Tables<'instance'>

const configured = (country: EngineCountry, length: EngineLength, firstCommand: string = '') =>
  firstCommand.includes(country.toLowerCase()) && firstCommand.includes(length.toLowerCase())

type RadioPairProps = {
  disabled: boolean
  selected: boolean
  onClick: EventHandler<SyntheticEvent<HTMLButtonElement | HTMLInputElement>> // is it even worth it?
  children: ReactNode | ReactNode[]
}

const RadioPair = ({ disabled, selected, onClick, children }: RadioPairProps) => {
  return (
    <>
      <input type="radio" disabled={disabled} checked={selected} onChange={onClick} />
      <button type="button" disabled={disabled} onClick={onClick}>
        {children}
      </button>
    </>
  )
}

export const GameSetupVariant = () => {
  const {
    instance,
    setInstance,
    entrants,
    flags: { ireland: irelandAllowed },
  } = useInstanceContext()

  const [optInstance, setOptInstance] = useOptimistic<Instance, [EngineCountry, EngineLength]>(
    instance,
    // optimistically, predict what the resulting list of entrants will look like
    (oldInstance, [country, length]) => ({
      ...oldInstance,
      commands: [`CONFIG ${entrants.length} ${country.toLowerCase()} ${length.toLowerCase()}`],
    })
  )

  const [_isPending, startTransition] = useTransition()

  const handleConfig = async (players: number, country: EngineCountry, length: EngineLength) => {
    startTransition(async () => {
      // optimistic reducer
      setOptInstance([country, length])
      const finalInstance = await config(
        instance.id,
        `CONFIG ${Math.max(players, 1)} ${country.toLowerCase()} ${length.toLowerCase()}`
      )
      // pessimistic reducer
      if (finalInstance) setInstance((oldInstance) => ({ ...oldInstance, ...finalInstance }))
    })
  }

  const isFranceLong = configured(EngineCountry.france, EngineLength.long, optInstance?.commands?.[0])
  const isFranceShort = configured(EngineCountry.france, EngineLength.short, optInstance?.commands?.[0])
  const isIrelandLong = configured(EngineCountry.ireland, EngineLength.long, optInstance?.commands?.[0])
  const isIrelandShort = configured(EngineCountry.ireland, EngineLength.short, optInstance?.commands?.[0])

  return (
    <>
      <hr />
      <h3>Mode</h3>
      <RadioPair
        selected={isFranceLong}
        disabled={isFranceLong}
        onClick={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.long)}
      >
        France {entrants?.length === 2 && '(long)'}
      </RadioPair>
      <br />
      <RadioPair
        selected={isIrelandLong}
        disabled={isIrelandLong || !irelandAllowed}
        onClick={() => handleConfig(entrants.length, EngineCountry.ireland, EngineLength.long)}
      >
        Ireland {entrants?.length === 2 && '(long)'}
      </RadioPair>
      {!irelandAllowed && <i>Disabled during beta</i>}
      <br />
      {entrants.length > 1 && (
        <>
          {' '}
          <RadioPair
            selected={isFranceShort}
            disabled={isFranceShort}
            onClick={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.short)}
          >
            France {entrants?.length >= 3 && '(short)'}
          </RadioPair>
          <br />
          <RadioPair
            selected={isIrelandShort}
            disabled={isIrelandShort || !irelandAllowed}
            onClick={() => handleConfig(entrants.length, EngineCountry.ireland, EngineLength.short)}
          >
            Ireland {entrants?.length >= 3 && '(short)'}
          </RadioPair>
          {!irelandAllowed && <i>Disabled during beta</i>}
          <br />
        </>
      )}
      <p>Country variants contain a different set of buildings. </p>
    </>
  )
}
