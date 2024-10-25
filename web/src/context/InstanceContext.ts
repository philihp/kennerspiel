'use client'

import { GameState, initialState, reducer } from 'hathora-et-labora-game'
import { createContext, createElement, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { REALTIME_LISTEN_TYPES, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, User } from '@supabase/supabase-js'
import { Tables } from '@/supabase.types'
import { useSupabaseContext } from './SupabaseContext'
import { reject } from 'ramda'

type InstanceContextType = {
  instance: Tables<'instance'>
  entrants: Tables<'entrant'>[]
  user?: User
  gameState?: GameState
}

type InstanceContextProviderProps = {
  user: User | null
  instance: Tables<'instance'>
  entrants: Tables<'entrant'>[]
  children: ReactNode | ReactNode[]
}

const InstanceContext = createContext<InstanceContextType>(
  {} as InstanceContextType
  // the "as InstanceContextType" here means it is possible instance might have an unchecked undefined
  // however since the InstanceContextProviderProps will always be setting this, it should be fine
)

export const InstanceContextProvider = ({
  children,
  user,
  instance: providedInstance,
  entrants: providedEntrants,
}: InstanceContextProviderProps) => {
  const { supabase } = useSupabaseContext()
  const [instance, setInstance] = useState<Tables<'instance'>>(providedInstance)
  const [entrants, setEntrants] = useState<Tables<'entrant'>[]>(providedEntrants)

  useEffect(() => {
    const channel = supabase
      ?.channel('schema-db-changes')
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          table: 'instance',
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
          schema: 'public',
          filter: `id=eq.${instance.id}`,
        },
        (payload) => {
          setInstance(payload.new as Tables<'instance'>)
        }
      )
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          table: 'entrant',
          event: '*',
          schema: 'public',
          filter: `instance_id=eq.${instance.id}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT:
              setEntrants([...entrants, payload.new as Tables<'entrant'>])
              break
            case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE:
              setEntrants([...reject<Tables<'entrant'>>((entrant) => entrant.id === payload.old.id)(entrants)])
              break
            case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE:
              setEntrants([
                ...reject<Tables<'entrant'>>((entrant) => entrant.id === payload.old.id)(entrants),
                payload.new as Tables<'entrant'>,
              ])
              break
          }
        }
      )
      .subscribe()
    return () => {
      channel?.unsubscribe()
    }
  }, [supabase, instance, entrants])

  const gameState = useMemo(() => {
    const c1 = [...instance.commands].map((s) => s.split(' '))
    return c1.reduce<GameState | undefined>(
      reducer as (state: GameState | undefined, [command, ...params]: string[]) => GameState | undefined,
      initialState
    )
  }, [instance])

  return createElement(
    InstanceContext.Provider,
    {
      value: {
        user: user === null ? undefined : user,
        instance,
        entrants,
        gameState,
      },
    },
    children
  )
}

export const useInstanceContext = () => useContext(InstanceContext)
