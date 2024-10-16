'use server'

import { createClient } from '@/utils/supabase/server'

export const connect = async (formData: FormData, captchaToken: string) => {
  const supabase = createClient()
  if (!formData.get('email')) return 'Missing an email address'
  if (!formData.get('password')) return 'Blank passwords are bad passwords'
  const { error } = await supabase.auth.signInWithPassword({
    email: `${formData.get('email')}`,
    password: `${formData.get('password')}`,
    options: { captchaToken },
  })
  return error?.message
}

export const skip = async (formData: FormData, captchaToken: string) => {
  const supabase = createClient()
  const {
    data: { user, session },
    error,
  } = await supabase.auth.signInAnonymously({
    options: { captchaToken },
  })
  console.log(JSON.stringify({ user, session }, undefined, 2))
  return error?.message
}
