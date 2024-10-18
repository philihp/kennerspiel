'use client'

import { GameState, GameStateSetup, initialState, reducer } from 'hathora-et-labora-game'
import { createContext, createElement, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSupabaseContext } from './SupabaseContext'
import { User } from '@supabase/supabase-js'

interface Instance {
  user?: User
  state?: GameState
  commands: string[]
}

interface InstanceContextProviderProps {
  user: User | null
  commands: string[]
  children: ReactNode | ReactNode[]
}

const InstanceContext = createContext<Instance>({
  commands: [],
})

export const InstanceContextProvider = ({ children, user, commands }: InstanceContextProviderProps) => {
  const exported = useMemo(() => {
    const c1 = ['CONFIG 3 france long', ...commands].map((s) => s.split(' '))
    return {
      user: user === null ? undefined : user,
      state: c1.reduce<GameState | undefined>(
        reducer as (state: GameState | undefined, [command, ...params]: string[]) => GameState | undefined,
        initialState
      ),
      commands,
    }
  }, [user, commands])
  return createElement(InstanceContext.Provider, { value: exported }, children)
}

export const useInstanceContext = () => useContext(InstanceContext)

export const useHathoraContext = () => {
  const context = useContext(InstanceContext)
  if (!context) {
    throw new Error('Component must be within the HathoraContext')
  }
  return context
}
