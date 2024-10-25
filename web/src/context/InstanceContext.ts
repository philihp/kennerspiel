'use client'

import { GameState, initialState, reducer } from 'hathora-et-labora-game'
import { createContext, createElement, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, User } from '@supabase/supabase-js'
import { Tables } from '@/supabase.types'
import { useSupabaseContext } from './SupabaseContext'

type InstanceContextType = {
  instance: Tables<'instance'>
  user?: User
  gameState?: GameState
}

type InstanceContextProviderProps = {
  user: User | null
  instance: Tables<'instance'>
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
}: InstanceContextProviderProps) => {
  const { supabase } = useSupabaseContext()
  const [instance, setInstance] = useState<Tables<'instance'>>(providedInstance)

  useEffect(() => {
    const channel = supabase
      ?.channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          table: 'instance',
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
          schema: 'public',
          filter: `id=eq.${instance.id}`,
        },
        (payload) => {
          console.log('OLD INSTANCE')
          console.log(JSON.stringify(instance, undefined, 2))
          console.log('NEW INSTANCE')
          console.log(
            JSON.stringify(
              {
                ...instance,
                ...payload.new,
              },
              undefined,
              2
            )
          )

          setInstance({
            ...instance,
            ...payload.new,
          } as Tables<'instance'>)
          // supabase
          //   .from('instance')
          //   .select()
          //   .eq('id', payload.old.id)
          //   .single()
          //   .then(({ data }) => {
          //     console.log('setInstance(', data, ') from ', currentInstance)
          //     setInstance(data)
          //   })
        }
      )
      .subscribe((status, err) => {
        console.log('subscribed to psql changes', status, err)
        if (status === 'SUBSCRIBED') {
          //
        }
      })
    return () => {
      channel?.unsubscribe()
    }
  }, [supabase])

  const gameState = useMemo(() => {
    const c1 = ['CONFIG 3 france long', ...instance.commands].map((s) => s.split(' '))
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
        gameState,
      },
    },
    children
  )
}

export const useInstanceContext = () => useContext(InstanceContext)
