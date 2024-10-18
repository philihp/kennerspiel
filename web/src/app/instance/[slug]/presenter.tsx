'use client'

import { createClient } from "@/utils/supabase/client"
import { REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES, RealtimeChannelSendResponse, User } from "@supabase/supabase-js"
import { useEffect, useMemo } from "react"
import { Board } from "./board"

type InstanceParams = {
  user: User | null
  params: {
    slug: string
  }
  commands: string[]
}

const Presenter = ({ params: { slug }, user, commands }: InstanceParams) => {
  const userId = user?.id
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (supabase === undefined) return;
    let channel = supabase.channel('instance', { config: { presence: { key: slug } } })
    channel.on(REALTIME_LISTEN_TYPES.PRESENCE, { event: 'sync' }, () => {
      const state = channel.presenceState()
      console.log('sync', state)
    })
    channel.subscribe(async (status) => {
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        const resp: RealtimeChannelSendResponse = await channel.track({ user_id: userId })
        // if (resp === 'ok') {
        //   router.push(`/${roomId}`)
        // } else {
        //   router.push(`/`)
        // }
      }
    })
  }, [slug, supabase, userId])

  return (
    <div>
      <i>userId: {userId}</i><br />
      {JSON.stringify(commands)}
      <hr />
      <Board commands={commands} />
    </div>
  )
}

export default Presenter
