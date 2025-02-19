'use client'

import { createClient } from '@/utils/supabase/client'
import { useCallback, useEffect, useState } from 'react'

type Instance = { id: string; created_at: string; commands: string[] }

export const InstancesList = () => {
  const [instances, setInstances] = useState<Instance[] | undefined>(undefined)

  const handleReload = useCallback(() => {
    setInstances(undefined)
    const supabase = createClient()
    supabase
      .from('instance')
      .select()
      .eq('hidden', false)
      .then(({ data }) => {
        setInstances(data ?? ([] as Instance[]))
      })
  }, [])

  useEffect(() => {
    handleReload()
  }, [handleReload])

  return (
    <>
      <button onClick={handleReload} type="button">
        Refresh
      </button>
      <ul>
        {instances === undefined && (
          <li>
            <i>...</i>
          </li>
        )}
        {instances !== undefined &&
          instances.map((instance) => (
            <li key={instance.id}>
              <a href={`instance/${instance.id}`}>{instance.id}</a>
            </li>
          ))}
        {instances?.length === 0 && (
          <li>
            <i>(none)</i>
          </li>
        )}
      </ul>
    </>
  )
}
