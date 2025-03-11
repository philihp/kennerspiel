import { useTranslations } from 'next-intl'
import { useInstanceContext } from '@/context/InstanceContext'
import { join, reloadEntrants } from './actions'
import { useEffect, useOptimistic, useTransition } from 'react'
import { Seat } from '@/components/seat'
import { Enums, Tables } from '@/supabase.types'
import { find, pipe, propEq, reject, splitWhen, tail } from 'ramda'

type PartEntrant = Pick<Tables<'entrant'>, 'color' | 'profile_id'>

export const GameSetupPlayers = () => {
  const t = useTranslations('app/instance/[slug]')

  const { instance, setInstance, entrants, setEntrants, user } = useInstanceContext()

  const [optEntrants, setOptEntrants] = useOptimistic<PartEntrant[], Enums<'color'> | undefined>(
    entrants,
    // optimistically, predict what the resulting list of entrants will look like
    (oldEntrants: PartEntrant[], color?: Enums<'color'>) =>
      pipe<[e: PartEntrant[]], PartEntrant[], [PartEntrant[], PartEntrant[]], PartEntrant[]>(
        reject<PartEntrant>((e) => e.profile_id === user?.id),
        splitWhen<PartEntrant>(propEq<Enums<'color'> | undefined, 'color'>(color, 'color')),
        ([head, trailer]) => [
          ...head, // everything before goes before
          {
            profile_id: user?.id,
            color,
          } as PartEntrant,
          ...tail(trailer),
        ]
      )(oldEntrants ?? [])
  )
  const findEntrant = (color: Enums<'color'>) => find<PartEntrant>(propEq(color, 'color'))(optEntrants)

  const [_isPending, startTransition] = useTransition()

  useEffect(() => {
    const timer = setInterval(async () => {
      if (instance === undefined) return
      const entrantList = await reloadEntrants(instance.id)
      setEntrants(entrantList)
    }, 618.3398875)
    return () => {
      clearInterval(timer)
    }
  }, [setEntrants, instance])

  const handleSelectColor = (color: Enums<'color'>) => async () => {
    startTransition(async () => {
      setOptEntrants(color)
      const [entrants, updatedInstance] = await join(instance.id, color)
      // pessimistically, update with what the server action returned
      if (updatedInstance) {
        setInstance(updatedInstance)
        setEntrants(entrants ?? [])
      }
    })
  }

  const handleLeave = async () => {
    startTransition(async () => {
      setOptEntrants(undefined)
      const [entrants, updatedInstance] = await join(instance.id)
      // pessimistically, update with what the server action returned
      if (updatedInstance) {
        setInstance(updatedInstance)
        setEntrants(entrants ?? [])
      }
    })
  }

  return (
    <>
      <hr />
      <h3>{t('players-count', { optEntrantsLength: optEntrants?.length })}</h3>
      <Seat clergyId="LB1R" entrant={findEntrant('red')} onClick={handleSelectColor('red')} onLeave={handleLeave} />
      <Seat clergyId="LB1G" entrant={findEntrant('green')} onClick={handleSelectColor('green')} onLeave={handleLeave} />
      <Seat clergyId="LB1B" entrant={findEntrant('blue')} onClick={handleSelectColor('blue')} onLeave={handleLeave} />
      <Seat clergyId="LB1W" entrant={findEntrant('white')} onClick={handleSelectColor('white')} onLeave={handleLeave} />
      <p>{t('player-order-randomization')}</p>
    </>
  )
}
