'use client'

import { GameState, initialState, reducer } from 'hathora-et-labora-game'
import { createContext, createElement, ReactNode, useContext, useMemo } from 'react'
import { User } from '@supabase/supabase-js'

type Instance = {
  id: string
  commands: string[]
}

type InstanceContextType = {
  instance: Instance
  user?: User
  state?: GameState
}

type InstanceContextProviderProps = {
  user: User | null
  instance: Instance
  children: ReactNode | ReactNode[]
}

const InstanceContext = createContext<InstanceContextType>({
  instance: {
    id: '123',
    commands: [],
  },
})

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

export const useHathoraContext = () => {
  const context = useContext(InstanceContext)
  if (!context) {
    throw new Error('Component must be within the HathoraContext')
  }
  return context
}
