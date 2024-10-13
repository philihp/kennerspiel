'use client'

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

type Instance = {
  id: string
  created_at: string
  commands: string[]
}

export const InstancesList = () => {
  const supabase = createClient()
  const [instances, setInstances] = useState<Instance[] | undefined>(undefined)

  const handleLoad = () => {
    supabase.from('instance').select().then(({ data }) => {
      setInstances(data ?? [] as Instance[])
    })
  }

  useEffect(() => {
    handleLoad()
  }, [handleLoad])

  return (
    <>
      <button onClick={handleLoad} type="button">Refresh</button>
      <ul>
        {instances === undefined && <li><i>...</i></li>}
        {instances !== undefined && instances.map((instance) => (
          <li key={instance.id}>
            <a href={`instance/${instance.id}`}>{instance.id}</a>
          </li>
        ))}
        {instances?.length === 0 && (
          <li><i>(none)</i></li>
        )}
      </ul>
    </>
  )
}
