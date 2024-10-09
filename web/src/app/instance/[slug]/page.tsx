'use client'

import { createClient } from '@/utils/supabase/client'
import { REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES, RealtimeChannelSendResponse } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

// const { data, error } = await supabase.from('instance').select();
// return <pre>{JSON.stringify({ data, error }, undefined, 2)}</pre>

type InstanceParams = {
  params: {
    slug: string
  }
}

const supabase = createClient()

const InstancePage = ({ params: { slug } }: InstanceParams) => {
  const [userId, setUserId] = useState('')

  useEffect(() => {
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
  }, [slug, userId])

  return (
    <div>
      <h1>{slug}</h1>
      <i>{userId}</i>
      <hr />
      <input type="text" size={50} onChange={(e) => setUserId(e.target.value)} value={userId} />
    </div>
  )
}

export default InstancePage
