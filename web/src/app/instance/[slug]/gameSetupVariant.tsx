import { useInstanceContext } from '@/context/InstanceContext'
import { EngineCountry, EngineLength } from '@/types'
import { config } from './actions'
import { Tables } from '@/supabase.types'
import { EventHandler, ReactNode, SyntheticEvent, useOptimistic, useTransition } from 'react'

type Instance = Tables<'instance'>

// solo-only rule variants, sent as an optional fifth CONFIG token
type SoloVariant = '' | 'robbins' | 'robbins!'

const configCommand = (players: number, country: EngineCountry, length: EngineLength, variant: SoloVariant) =>
  [`CONFIG`, Math.max(players, 1), country.toLowerCase(), length.toLowerCase(), ...(variant ? [variant] : [])].join(' ')

const configured = (
  country: EngineCountry,
  length: EngineLength,
  firstCommand: string = '',
  variant: SoloVariant = ''
) => {
  const [, , c, l, v = ''] = firstCommand.split(' ')
  return c === country.toLowerCase() && l === length.toLowerCase() && v === variant
}

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

  const [optInstance, setOptInstance] = useOptimistic<Instance, [EngineCountry, EngineLength, SoloVariant]>(
    instance,
    // optimistically, predict what the resulting list of entrants will look like
    (oldInstance, [country, length, variant]) => ({
      ...oldInstance,
      commands: [configCommand(entrants.length, country, length, variant)],
    })
  )

  const [_isPending, startTransition] = useTransition()

  const handleConfig = async (
    players: number,
    country: EngineCountry,
    length: EngineLength,
    variant: SoloVariant = ''
  ) => {
    startTransition(async () => {
      // optimistic reducer
      setOptInstance([country, length, variant])
      const finalInstance = await config(instance.id, configCommand(players, country, length, variant))
      // pessimistic reducer
      if (finalInstance) setInstance((oldInstance) => ({ ...oldInstance, ...finalInstance }))
    })
  }

  const isFranceLong = configured(EngineCountry.france, EngineLength.long, optInstance?.commands?.[0])
  const isFranceShort = configured(EngineCountry.france, EngineLength.short, optInstance?.commands?.[0])
  const isIrelandLong = configured(EngineCountry.ireland, EngineLength.long, optInstance?.commands?.[0])
  const isIrelandShort = configured(EngineCountry.ireland, EngineLength.short, optInstance?.commands?.[0])
  const isFranceRobbins = configured(EngineCountry.france, EngineLength.long, optInstance?.commands?.[0], 'robbins')
  const isFranceRobbinsAggressive = configured(
    EngineCountry.france,
    EngineLength.long,
    optInstance?.commands?.[0],
    'robbins!'
  )

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
      {entrants.length === 1 && (
        <>
          <RadioPair
            selected={isFranceRobbins}
            disabled={isFranceRobbins}
            onClick={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.long, 'robbins')}
          >
            France (Robbins)
          </RadioPair>
          <br />
          <RadioPair
            selected={isFranceRobbinsAggressive}
            disabled={isFranceRobbinsAggressive}
            onClick={() => handleConfig(entrants.length, EngineCountry.france, EngineLength.long, 'robbins!')}
          >
            France (Robbins, aggressive)
          </RadioPair>
          <br />
        </>
      )}
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
      {entrants.length === 1 && (
        <p>
          In the Robbins variants, the neutral player takes a random good from the wheel each round, and builds random
          buildings during the game.
        </p>
      )}
    </>
  )
}
