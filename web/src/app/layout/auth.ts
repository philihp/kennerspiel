'use client'

import { createClient } from '@/utils/supabase/server'
import { AuthError, User } from '@supabase/supabase-js'

export const useAuth = async () => {
  const supabase = createClient()

  let user: User | null = null
  let error: AuthError | null = null

  const userRes = await supabase.auth.getUser()
  user = userRes.data?.user
  error = userRes.error
  if (!user) {
    const anonRes = await await supabase.auth.signInAnonymously()
    user = anonRes.data?.user
    error = anonRes.error
  }
  return { user, error }
}
