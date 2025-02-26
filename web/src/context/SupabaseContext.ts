'use client'

import { Database } from '@/supabase.types'
import { createClient } from '@/utils/supabase/client'
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import {
  createContext,
  createElement,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

interface SupabaseContextType {
  supabase?: SupabaseClient
  channel?: RealtimeChannel
  setChannel: (state?: RealtimeChannel) => void
  sequence?: number
  setSequence: Dispatch<SetStateAction<number>>
}

interface SupabaseContextProviderProps {
  children: ReactNode | ReactNode[]
}

const SupabaseContext = createContext<SupabaseContextType>({
  setChannel: () => {},
  setSequence: () => {},
})

export const SupabaseContextProvider = ({ children }: SupabaseContextProviderProps) => {
  const supabase = createClient()
  const [channel, setChannel] = useState<RealtimeChannel | undefined>(undefined)
  const [sequence, setSequence] = useState(100)

  return createElement(
    SupabaseContext.Provider,
    { value: { supabase, channel, setChannel, sequence, setSequence } },
    children
  )
}

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('Component must be within the HathoraContext')
  }
  return context
}
