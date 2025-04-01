'use client'

import { Instance } from '@/components/instance'
import { Tables } from '@/supabase.types'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  user: User | null
}

type PartialEntrant = Pick<Tables<'entrant'>, 'profile_id' | 'color'>
type InstanceWithEntrants = Tables<'instance'> & { entrant: PartialEntrant[] }

export const YourInstances = ({ user }: Props) => {
  const [instances, setInstances] = useState<InstanceWithEntrants[]>([])
  const userId = user?.id ?? 'NO_USER'

  const handleReload = useCallback(() => {
    setInstances([])
    const supabase = createClient()
    supabase
      .from('entrant')
      .select(
        `
        instance (
          *,
          entrant(profile_id, color)
        )`
      )
      .eq('profile_id', userId)
      .order('instance(updated_at)', { ascending: false })
      .then(({ data }) => {
        const newData =
          data?.map(({ instance }) => {
            const entrant = instance?.entrant ?? []
            return {
              ...instance,
              entrant,
            } as InstanceWithEntrants
          }) ?? []
        setInstances(newData)
      })
  }, [setInstances, userId])

  useEffect(() => {
    handleReload()
  }, [handleReload])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {instances === undefined && <i>...</i>}
      {instances !== undefined &&
        instances.map(({ entrant, ...instance }) => (
          <Instance key={instance.id} instance={instance} entrants={entrant} />
        ))}
      {instances?.length === 0 && <i>(no instances)</i>}
    </div>
  )
}
