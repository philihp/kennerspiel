import { useInstanceContext } from '@/context/InstanceContext'
import { join } from './actions'
import { useOptimistic, useTransition } from 'react'
import { Seat } from '@/components/seat'
import { Enums, Tables } from '@/supabase.types'
import { find, pipe, propEq, reject, splitWhen, tail } from 'ramda'

type PartEntrant = Pick<Tables<'entrant'>, 'color' | 'profile_id'>

export const GameSetupPlayers = () => {
  const { instance, entrants, setEntrants, user } = useInstanceContext()

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

  const handleSelectColor = (color: Enums<'color'>) => async () => {
    startTransition(async () => {
      setOptEntrants(color)
      const newEntrants = await join(instance.id, color)
      // pessimistically, update with what the server action returned
      setEntrants(newEntrants ?? [])
    })
  }

  const handleLeave = async () => {
    startTransition(async () => {
      setOptEntrants(undefined)
      const newEntrants = await join(instance.id)
      // pessimistically, update with what the server action returned
      setEntrants(newEntrants ?? [])
    })
  }

  return (
    <>
      <h3>Players ({entrants?.length})</h3>
      <Seat clergyId="LB1R" entrant={findEntrant('red')} onClick={handleSelectColor('red')} onLeave={handleLeave} />
      <Seat clergyId="LB1G" entrant={findEntrant('green')} onClick={handleSelectColor('green')} onLeave={handleLeave} />
      <Seat clergyId="LB1B" entrant={findEntrant('blue')} onClick={handleSelectColor('blue')} onLeave={handleLeave} />
      <Seat clergyId="LB1W" entrant={findEntrant('white')} onClick={handleSelectColor('white')} onLeave={handleLeave} />
      <p>Player order will be randomized upon start.</p>
    </>
  )
}
