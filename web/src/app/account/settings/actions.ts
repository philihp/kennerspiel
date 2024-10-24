'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export const disconnect = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) {
    return error?.message
  }
  redirect('/')
}

export const changePassword = async (formData: FormData) => {
  const supabase = createClient()
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string
  if (password !== confirm) {
    return 'Passwords do not match'
  }
  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return error?.message
  }
}

export const linkEmail = async (formData: FormData) => {
  const supabase = createClient()
  const email = formData.get('email') as string

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.updateUser({ email })

  if (authError || !user) {
    return authError?.message
  }

  const { error: profError } = await supabase.from('profile').upsert({ id: user?.id, email })
  if (profError) {
    await supabase.auth.signOut({ scope: 'local' })
    return profError?.message
  }
}
