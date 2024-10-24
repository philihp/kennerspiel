'use client'

import { GameState, initialState, reducer } from 'hathora-et-labora-game'
import { createContext, createElement, ReactNode, useContext, useMemo } from 'react'
import { User } from '@supabase/supabase-js'
import { Tables } from '@/supabase.types'

type InstanceContextType = {
  instance: Tables<'instance'>
  user?: User
  state?: GameState
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

export const InstanceContextProvider = ({ children, user, instance }: InstanceContextProviderProps) => {
  const exported = useMemo(() => {
    const c1 = ['CONFIG 3 france long', ...instance.commands].map((s) => s.split(' '))
    return {
      user: user === null ? undefined : user,
      state: c1.reduce<GameState | undefined>(
        reducer as (state: GameState | undefined, [command, ...params]: string[]) => GameState | undefined,
        initialState
      ),
      instance,
    }
  }, [user, instance])
  return createElement(InstanceContext.Provider, { value: exported }, children)
}

export const useInstanceContext = () => useContext(InstanceContext)
