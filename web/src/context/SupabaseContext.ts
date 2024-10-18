'use client'

import { createClient } from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, createElement, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface Instance {
  supabase?: SupabaseClient
}

interface SupabaseContextProviderProps {
  children: ReactNode | ReactNode[]
}

const SupabaseContext = createContext<Instance>({})

export const SupabaseContextProvider = ({ children }: SupabaseContextProviderProps) => {
  const supabase = createClient()
  return createElement(SupabaseContext.Provider, { value: { supabase } }, children)
}

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('Component must be within the HathoraContext')
  }
  return context
}
