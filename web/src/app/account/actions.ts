'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/utils/supabase/server'

export const logout = async (redirectTo: string) => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) {
    return error?.message
  }
  revalidatePath('/account')
  redirect(redirectTo)
}
