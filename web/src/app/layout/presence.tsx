'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useReducer, useState } from 'react'

const supabase = createClient()

type State = {}

type Action = {}

const presenceReducer = (state: State, action: Action) => {
  console.log({ state, action })
  return state
}

export const Presence = () => {
  const [store, dispatch] = useReducer(presenceReducer, { initial: 'initial' })

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
        },
        (payload) => {
          console.log({ payload })
          dispatch(payload)
        }
      )
      .subscribe((status, err) => {
        console.log('subscribed to psql changes', status, err)
        if (status === 'SUBSCRIBED') setLive(true)
      })
    // TODO return something that unsubscribes
  }, [])

  const [live, setLive] = useState(false)
  return <span title={JSON.stringify(store, undefined, 2)}>{live ? '🟢' : '🔴'} </span>
}
