'use client'

import { Instance } from '@/components/instance'
import { Tables } from '@/supabase.types'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  user: User | null
}

type InstanceWithEntrants = Tables<'instance'> & { entrant: Tables<'entrant'>[] }

export const YourInstances = ({ user }: Props) => {
  const [instances, setInstances] = useState<InstanceWithEntrants[]>([])
  const userId = user?.id ?? 'NO_USER'

  const handleReload = useCallback(() => {
    setInstances([])
    const supabase = createClient()
    supabase
      .from('entrant')
      .select(`*, instance(*)`)
      .eq('profile_id', userId)
      .then(({ data }) => {
        const newData =
          data?.map((entrant) => {
            return {
              ...entrant.instance,
              entrant: [{ ...entrant }],
            } as InstanceWithEntrants
          }) ?? []
        setInstances(newData)
      })
  }, [])

  useEffect(() => {
    handleReload()
  }, [handleReload])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {instances === undefined && <i>...</i>}
      {instances !== undefined &&
        instances.map((instance) => <Instance key={instance.id} instance={instance} entrants={instance.entrant} />)}
      {instances?.length === 0 && <i>(no instances)</i>}
    </div>
  )
}
