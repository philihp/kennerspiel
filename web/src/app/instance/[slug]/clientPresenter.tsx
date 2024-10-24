'use client'

import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannelSendResponse,
  User,
} from '@supabase/supabase-js'
import { useEffect, useMemo } from 'react'
import { Board } from './board'
import { useInstanceContext } from '@/context/InstanceContext'
import { useSupabaseContext } from '@/context/SupabaseContext'

type InstanceParams = {
  params: {
    slug: string
  }
}

export const ClientPresenter = ({ params: { slug } }: InstanceParams) => {
  const { supabase } = useSupabaseContext()
  const { user } = useInstanceContext()

  const userId = user?.id

  // useEffect(() => {
  //   console.log('clientpresenter setup', userId)
  //   if (supabase === undefined) return
  //   let channel = supabase.channel('FOO', {
  //     config: {
  //       presence: {
  //         key: userId,
  //         // key: slug,
  //       },
  //     },
  //   })
  //   channel.on(REALTIME_LISTEN_TYPES.PRESENCE, { event: 'sync' }, () => {
  //     const state = channel.presenceState()
  //     console.log('sync', state)
  //   })
  //   channel.subscribe(async (status) => {
  //     if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
  //       const resp: RealtimeChannelSendResponse = await channel.track({ date: `${new Date()}`, user_id: userId })
  //       // if (resp === 'ok') {
  //       //   router.push(`/${roomId}`)
  //       // } else {
  //       //   router.push(`/`)
  //       // }
  //     }
  //   })
  // }, [slug, supabase, userId])

  return (
    <div>
      <i>userId: {userId}</i>
      <br />
      <hr />
      <Board />
    </div>
  )
}
