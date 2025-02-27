'use client'

import { useSupabaseContext } from '@/context/SupabaseContext'
import { User } from '@supabase/supabase-js'
import { REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { join, keys, pipe, slice, split, tail } from 'ramda'
import { useEffect, useState } from 'react'

type PresenceParams = {
  user: User | null
}

const pathToKey: (path: string) => string = pipe<
  [string], // input type
  string[], // after split
  string[], // after tail
  string[], // after slice
  string // final output after join
>(
  //
  split('/'),
  tail,
  slice(0, 2),
  join(':')
)

export const Presence = ({ user }: PresenceParams) => {
  const path = usePathname()
  const router = useRouter()
  const [connected, setConnected] = useState<boolean>(false)
  const [count, setCount] = useState<number | undefined>(undefined)
  const { supabase, setChannel, channel: channelRef, sequence, setSequence } = useSupabaseContext()

  const channelKey = pathToKey(path)

  useEffect(() => {
    if (supabase === undefined) return
    const channel = supabase?.channel(channelKey, {
      config: {
        broadcast: { self: false },
        presence: { key: user?.id },
      },
    })
    setChannel(channel)

    channel.on(REALTIME_LISTEN_TYPES.PRESENCE, { event: 'sync' }, () => {
      const present = channel.presenceState()
      setCount(keys(present).length)
    })
    channel.on(REALTIME_LISTEN_TYPES.BROADCAST, { event: 'sync' }, ({ payload }) => {
      router.replace(path, { scroll: false })
    })
    channel.subscribe(async (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
      if (err) {
        console.error({ err })
        return
      }
      setConnected(true)
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        await channel.track({ user_id: user?.id, online_at: new Date().toISOString() })
      }
    })

    return () => {
      channel?.unsubscribe()
      channel && supabase?.removeChannel(channel)
    }
  }, [supabase, user?.id, channelKey, path, setSequence])

  return (
    <>
      {connected ? '🟢' : '🔴'}{' '}
      {count && (
        <>
          {' '}
          ({count} viewers) {sequence}{' '}
        </>
      )}
      <b>{user?.id}</b>{' '}
    </>
  )
}
