'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export const login = async (formData: FormData, captchaToken: string) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signInWithPassword({
    email: `${formData.get('email')}`,
    password: `${formData.get('password')}`,
    options: { captchaToken },
  })

  return error?.message
}