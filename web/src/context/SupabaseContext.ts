'use client'

import { createClient } from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, createElement, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

interface SupabaseContextType {
  supabase: SupabaseClient
  redirectTo: string
  setRedirectTo: Dispatch<SetStateAction<string>>
}

interface SupabaseContextProviderProps {
  children: ReactNode | ReactNode[]
}

const SupabaseContext = createContext<SupabaseContextType>({} as SupabaseContextType)

export const SupabaseContextProvider = ({ children }: SupabaseContextProviderProps) => {
  const [redirectTo, setRedirectTo] = useState('/')
  const supabase = createClient()
  return createElement(SupabaseContext.Provider, { value: { supabase, redirectTo, setRedirectTo } }, children)
}

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('Component must be within the Supabase Context')
  }
  return context
}
