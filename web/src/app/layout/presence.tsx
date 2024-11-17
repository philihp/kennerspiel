'use client'

import { useSupabaseContext } from '@/context/SupabaseContext'
import { REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES, User } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type PresenceParams = {
  user: User | null
}

export const Presence = ({ user }: PresenceParams) => {
  const [connected, setConnected] = useState<boolean>(false)
  const [count, setCount] = useState<number | undefined>(undefined)
  const { supabase } = useSupabaseContext()
  const key = usePathname()
  useEffect(() => {
    if (supabase === undefined) return
    let channel = supabase.channel(`presence:${key}`, { config: { presence: { key } } })
    channel.on(REALTIME_LISTEN_TYPES.PRESENCE, { event: 'sync' }, () => {
      const state = channel.presenceState()
      setCount(state[key]?.length)
    })
    channel.subscribe(async (status) => {
      setConnected(true)
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        await channel.track({ user_id: user?.id })
      }
    })
  }, [supabase, user?.id, key])

  return (
    <>
      {connected ? '🟢' : '🔴'} {count && <> ({count} viewers) </>}
    </>
  )
}
